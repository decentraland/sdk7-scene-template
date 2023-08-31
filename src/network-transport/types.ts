import { Entity } from '@dcl/sdk/ecs'

export type Socket = WebSocket & {
  binaryType: string
  send(data: string | Uint8Array): void
}

export type NetworkEntityFactory = {
  addEntity(): Entity
}

export enum MessageType {
  Auth = 1,
  Init = 2,
  Crdt = 3
}

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
