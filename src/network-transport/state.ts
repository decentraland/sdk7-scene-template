import { ReadWriteByteBuffer } from '@dcl/ecs/dist/serialization/ByteBuffer'
import { engine } from "@dcl/sdk/ecs";

export function engineToCrdt(): Uint8Array {
  const crdtBuffer = new ReadWriteByteBuffer()

  for (const itComponentDefinition of engine.componentsIter()) {
    itComponentDefinition.dumpCrdtStateToBuffer(crdtBuffer)
  }
  return crdtBuffer.toBinary()
}
