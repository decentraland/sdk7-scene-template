import { ReadWriteByteBuffer } from '@dcl/ecs/dist/serialization/ByteBuffer'
import { getHeaders } from '~system/SignedFetch'

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


export async function connect() {
  const url = 'ws://localhost:3000/ws'
  const ws = new WebSocket(url) as Socket
  ws.binaryType = 'arraybuffer'

  ws.onopen = async () => {
    console.log('WS Server Sync connected')
    const { headers } = await getHeaders({ url, init: { headers: {} } })
    ws.send(craftMessage(MessageType.Auth, encodeString(JSON.stringify(headers))))
  }

  return ws
}