// @ts-ignore
import { isServer, crdtSendNetwork, registerClientObserver } from '~system/EngineApi'
import { Transport, TransportMessage, SyncEntity, engine } from '@dcl/ecs'
import { RESERVED_STATIC_ENTITIES } from '@dcl/ecs/dist/engine/entity'
import { serializeCrdtMessages } from '@dcl/sdk/internal/transports/logger'
import { MessageType, connect, craftMessage } from './ws'
import { PointerEventsResult } from '@dcl/sdk/ecs'

let connected = false
let connectedClients = new Set()

export async function createNetworkTransport(url?: string) {
  if (connected) return
  connected = true
  // TODO: we need to add 1 transport for each client.
  if (isServer && (await isServer({})).isServer) {
    ;(globalThis as any).testing((client: any) => {
      console.log({ client })
    })

    const SYSTEM_SECONDS = 2
    let currentTime = 0

    engine.addSystem((dt: number) => {
      currentTime += dt
      if (currentTime <= SYSTEM_SECONDS) return

      async function getClients() {
        const resp = await isServer({})

        for (const clientId of resp.clients) {
          if (!connectedClients.has(clientId)) {
            createNetworkSceneTransport(clientId)
          }
        }
        connectedClients = new Set(resp.clients)
      }
      getClients()
      currentTime = 0
    })

    function createNetworkSceneTransport(id: string) {
      const transport: Transport = {
        filter: (message) => {
          if (!connectedClients.has(id)) return false
          return syncFilter(message)
        },
        send: async (message) => {
          const response = await crdtSendNetwork({ data: message, clientId: id })

          if (response && response.data && response.data.length) {
            if (transport.onmessage) {
              for (const byteArray of response.data) {
                // Log messages
                const logMessages = Array.from(serializeCrdtMessages('RecievedMessages', byteArray, engine))
                if (logMessages.length) console.log(logMessages)
                // Log messages

                transport.onmessage(byteArray)
              }
            }
          }
        }
      }
      engine.addTransport(transport)
    }
  } else {
    const ws = await connect()
    const messagesToProcess: Uint8Array[] = []
    const transport: Transport = {
      filter: syncFilter,
      send: sendTo
    }

    ws.onmessage = (event) => {
      if (event.data.byteLength) {
        messagesToProcess.push(new Uint8Array(event.data))
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