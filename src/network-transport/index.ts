/* eslint-disable no-var */
import { isServer } from '~system/EngineApi'
import { PointerEventsResult, Entity, Transport, TransportMessage, SyncEntity, engine } from '@dcl/ecs'
import { RESERVED_STATIC_ENTITIES, RESERVED_LOCAL_ENTITIES } from '@dcl/ecs/dist/engine/entity'
import { serializeCrdtMessages } from '@dcl/sdk/internal/transports/logger'
import { ReadWriteByteBuffer } from '@dcl/ecs/dist/serialization/ByteBuffer'
import { getHeaders } from '~system/SignedFetch'
import { engineToCrdt } from './state'

export enum MessageType {
  Auth = 1,
  Init = 2,
  Crdt = 3
}

export function encodeString(s: string): Uint8Array {
  const buffer = new ReadWriteByteBuffer()
  buffer.writeUtf8String(s)
  return buffer.readBuffer()
}

export function craftMessage(msgType: MessageType, payload: Uint8Array): Uint8Array {
  const msg = new Uint8Array(payload.byteLength + 1)
  msg.set([msgType])
  msg.set(payload, 1)
  return msg
}

type Socket = WebSocket & {
  binaryType: string
  send(data: string | Uint8Array): void
}

export type NetworkEntityFactory = {
  addEntity(): Entity
}

function createNetworkEntityFactory(reservedLocalEntities: number, range: [number, number]) {
  return engine.addNetworkManager(reservedLocalEntities, range)
}

let connected = false
const connectedClients = new Set<string>()

declare global {
  type ClientEvent =
    | {
        type: 'open'
        clientId: string
        client: {
          sendCrdtMessage(message: Uint8Array): Promise<void>
          getMessages(): Uint8Array[]
        }
      }
    | { type: 'close'; clientId: string }
  var updateCRDTState: (crdt: Uint8Array) => void
  var registerClientObserver: (fn: (event: ClientEvent) => void) => void
}

async function createServerTransport(): Promise<NetworkEntityFactory> {
  engine.addTransport({
    send: async (message) => {
      if (message.byteLength) {
        globalThis.updateCRDTState(engineToCrdt())
      }
    },
    filter: syncFilter
  })
  globalThis.registerClientObserver((event) => {
    const { type } = event
    if (type === 'open') {
      const { clientId, client } = event
      const transport: Transport = {
        filter: (message) => {
          if (!connectedClients.has(clientId)) return false
          return syncFilter(message)
        },
        send: async (message) => {
          if (message.byteLength > 0) {
            await client.sendCrdtMessage(message)
          }

          if (transport.onmessage) {
            const messages = client.getMessages()
            for (const byteArray of messages) {
              // Log messages
              const logMessages = Array.from(serializeCrdtMessages('RecievedMessages', byteArray, engine))
              if (logMessages.length) {
                console.log(logMessages)
              }
              // Log messages

              transport.onmessage(byteArray)
            }
          }
        }
      }

      engine.addTransport(transport)
      connectedClients.add(event.clientId)
    } else if (type === 'close') {
      connectedClients.delete(event.clientId)
    }
  })

  // TODO: add this to the server context?
  // This numbers should be fetched by the server
  return createNetworkEntityFactory(2060, [2061, 2061 + 512])
}

async function createClientTransport(url: string): Promise<NetworkEntityFactory> {
  const messagesToProcess: Uint8Array[] = []

  return new Promise<NetworkEntityFactory>((resolve, reject) => {
    try {
      const ws = new WebSocket(url) as Socket
      ws.binaryType = 'arraybuffer'

      ws.onopen = async () => {
        console.log('WS Server Sync connected')
        const { headers } = await getHeaders({ url, init: { headers: {} } })
        ws.send(craftMessage(MessageType.Auth, encodeString(JSON.stringify(headers))))

        const transport: Transport = {
          filter: syncFilter,
          send: async (message: Uint8Array) => {
            ws.send(craftMessage(MessageType.Crdt, message))
            if (messagesToProcess && messagesToProcess.length) {
              if (transport.onmessage) {
                for (const byteArray of messagesToProcess) {
                  // Log messages
                  const logMessages = Array.from(serializeCrdtMessages('RecievedMessages', byteArray, engine))
                  if (logMessages.length) console.log(logMessages)
                  // Log messages
                  transport.onmessage(byteArray)
                }
              }
            }
            messagesToProcess.length = 0
          }
        }
        engine.addTransport(transport)
      }

      ws.onmessage = (event) => {
        if (event.data.byteLength) {
          let offset = 0
          const r = new Uint8Array(event.data)
          const view = new DataView(r.buffer)
          const msgType = view.getUint8(offset)
          offset += 1

          if (msgType === MessageType.Crdt) {
            messagesToProcess.push(r.subarray(offset))
          } else if (msgType === MessageType.Init) {
            const start = view.getUint32(offset)
            offset += 4
            const size = view.getUint32(offset)
            offset += 4
            const localEntitiesReserved = view.getUint32(offset)
            offset += 4
            resolve(createNetworkEntityFactory(localEntitiesReserved, [start, start + size]))
            messagesToProcess.push(r.subarray(offset))
          }
        }
      }

      ws.onerror = (e) => {
        console.error(e)
        reject(e)
      }
    } catch (err) {
      reject(err)
    }
  })
}

export async function createNetworkTransport(url: string): Promise<NetworkEntityFactory> {
  if (connected) {
    throw new Error('Transport is already created')
  }
  connected = true
  return isServer && (await isServer({})).isServer ? createServerTransport() : createClientTransport(url)
}

function syncFilter(message: Omit<TransportMessage, 'messageBuffer'>) {
  if (!connected) return false

  if ((message as any).componentId === PointerEventsResult.componentId) {
    return false
  }

  // filter messages from reserved entities.
  if (message.entityId <= RESERVED_STATIC_ENTITIES) {
    return false
  }

  if (message.entityId <= RESERVED_LOCAL_ENTITIES) {
    return false
  }
  // Network Entity Always

  // TBD: First component
  if ((message as any).timestamp <= 1) {
    return true
  }

  const sync = SyncEntity.getOrNull(message.entityId)
  if (!sync) return false

  if ((message as any).componentId && sync.componentIds.includes((message as any).componentId)) {
    return true
  }

  return false
}
