import { InputAction, engine, pointerEventsSystem } from '@dcl/sdk/ecs'
import { bounceScalingSystem, changeColorSystem, circularSystem } from './systems'
import { ReadWriteByteBuffer } from '@dcl/ecs/dist/serialization/ByteBuffer'

import { setupUi } from './ui'
import { createCube } from './factory'
import { getHeaders } from '~system/SignedFetch'

// Defining behavior. See `src/systems.ts` file.
engine.addSystem(circularSystem)
engine.addSystem(bounceScalingSystem)
engine.addSystem(changeColorSystem)

export enum MessageType {
  Auth = 1
}

function encodeString(s: string): Uint8Array {
  const buffer = new ReadWriteByteBuffer()
  buffer.writeUtf8String(s)
  return buffer.readBuffer()
}

function craftMessage(msgType: MessageType, payload: Uint8Array): Uint8Array {
  const msg = new Uint8Array(payload.byteLength + 1)
  msg.set([msgType])
  msg.set(payload, 1)
  return msg
}

type Socket = WebSocket & {
  binaryType: string
  send(data: string | Uint8Array): void
}

async function connect() {
  const url = 'ws://localhost:3000/ws'
  const ws = new WebSocket(url) as Socket
  ws.binaryType = 'arraybuffer'

  ws.onopen = async () => {
    const { headers } = await getHeaders({ url, init: { headers: {} } })

    ws.send(craftMessage(MessageType.Auth, encodeString(JSON.stringify(headers))))
  }

  ws.onmessage = (event) => {
    // const x = new Uint8Array(event.data)
    // const [msgType, message] = decodeMessage(x)
    // const msgType = data[0] as number
    // return [msgType, data.subarray(1)]
  }
}

export async function main() {
  await connect()
  // draw UI
  setupUi()
  const entity = createCube(1, 1, 1)
  pointerEventsSystem.onPointerDown(
    { entity: entity, opts: { button: InputAction.IA_POINTER, hoverText: 'Spawn cube' } },
    function () {
      createCube(1 + Math.random() * 8, Math.random() * 8, 1 + Math.random() * 8)
    }
  )
}
