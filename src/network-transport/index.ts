// @ts-ignore
import { isServer, registerClientObserver } from '~system/EngineApi'
import { Transport, TransportMessage, SyncEntity, engine } from '@dcl/ecs'
import { RESERVED_STATIC_ENTITIES } from '@dcl/ecs/dist/engine/entity'
import { serializeCrdtMessages } from '@dcl/sdk/internal/transports/logger'
import { MessageType, connect, craftMessage } from './ws'
import { PointerEventsResult } from '@dcl/sdk/ecs'

let connected = false
const connectedClients = new Set<string>()

export async function createNetworkTransport(url?: string) {
  if (connected) return
  connected = true
  if (isServer && (await isServer({})).isServer) {
    ;(globalThis as any).registerClientObserver((event: any) => {
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
  } else {
    const ws = await connect()
    const messagesToProcess: Uint8Array[] = []
    const transport: Transport = {
      filter: syncFilter,
      send: sendTo
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

    async function sendTo(message: Uint8Array) {
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
    engine.addTransport(transport)
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
