import { isServer } from '~system/EngineApi'
import { Transport, TransportMessage, SyncEntity, engine } from '@dcl/ecs'
import { RESERVED_STATIC_ENTITIES } from '@dcl/ecs/dist/engine/entity'
import { serializeCrdtMessages } from '@dcl/sdk/internal/transports/logger'
import { PointerEventsResult } from '@dcl/sdk/ecs'
import { ReadWriteByteBuffer } from '@dcl/ecs/dist/serialization/ByteBuffer'
import { getHeaders } from '~system/SignedFetch'
import { engineToCrdt } from './state'

export enum MessageType {
  Auth = 1,
  Crdt = 2
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


function serverSetup() {
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
}

function clientSetup(url: string) {
  const messagesToProcess: Uint8Array[] = []

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
      const r = new Uint8Array(event.data)
      const msgType = r[0]
      if (msgType === MessageType.Crdt) {
        messagesToProcess.push(r.subarray(1))
      }
    }
  }

  ws.onerror = (e) => {
    console.error(e)
  }
}

export async function createNetworkTransport(url: string) {
  if (connected) return
  connected = true
  if (isServer && (await isServer({})).isServer) {
    serverSetup()
  } else {
    clientSetup(url)
  }
}

function syncFilter(message: Omit<TransportMessage, 'messageBuffer'>) {
  if ((message as any).componentId === PointerEventsResult.componentId) {
    return false
  }

  // filter messages from reserved entities.
  if (message.entityId <= RESERVED_STATIC_ENTITIES) {
    return false
  }
  // If its a new component, we must send it
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
