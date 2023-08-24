import { isServer, crdtSendNetwork } from '~system/EngineApi'

import { Transport, TransportMessage, SyncEntity, engine } from '@dcl/ecs'
import { RESERVED_STATIC_ENTITIES } from '@dcl/ecs/dist/engine/entity'
import { serializeCrdtMessages } from '@dcl/sdk/internal/transports/logger'
import { MessageType, connect, craftMessage } from './ws'

let connected = false


export async function createNetworkServerTransport() {
  if (connected) return
  connected = true

  // TODO: we need to add 1 transport for each client.
  if (isServer && (await isServer({})).isServer) {
    const transport = createTransport(sendTo)

    async function sendTo(message: Uint8Array) {
      const response = await crdtSendNetwork({ data: message })

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
    engine.addTransport(transport)
  } else {
    const ws = await connect()
    const messagesToProcess: Uint8Array[] = []
    const transport = createTransport(sendTo)

    ws.onmessage = (data) => {
      messagesToProcess.push(data.data)
    }

    async function sendTo(message: Uint8Array) {
      ws.send(craftMessage(MessageType.Crdt, message))
      if (messagesToProcess && messagesToProcess.length) {
        if (transport.onmessage) {
          for (const byteArray of messagesToProcess) {
            transport.onmessage(byteArray)
          }
        }
      }
    }
    engine.addTransport(transport)
  }
}

function createTransport(sendTo: (message: Uint8Array) => Promise<void>) {
  const commsNetworkSyncTransport: Transport = {
    async send(message) {
      try {
        const messages = Array.from(serializeCrdtMessages('NetworkServerSync', message, engine))
        if (messages.length) console.log(messages)
        await sendTo(message)
      } catch (error) {
        // this is the console.error of the scene
        // eslint-disable-next-line no-console
        console.error(error)
        // debugger
      }
    },
    filter(message: TransportMessage) {
      // TODO: pointer event result component
      if ((message as any).componentId === 1063) {
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
  }
  return commsNetworkSyncTransport
}