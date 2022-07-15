import { getNextComponentId } from '../components/customComponentIds'

export type TimestampListenerType = {
  shotedIds: Map<number, number>
}

export const TimestampListenerDef = {
  serialize(value: TimestampListenerType, builder: ByteBuffer): void {
    builder.writeInt32(value.shotedIds.size)
    for (const [k, v] of value.shotedIds.entries()) {
      builder.writeInt32(k)
      builder.writeInt32(v)
    }
  },
  deserialize(reader: ByteBuffer): TimestampListenerType {
    const newValue: TimestampListenerType = {
      shotedIds: new Map()
    }

    const mapSize = reader.readInt32()
    for (const _i of Array.from({ length: mapSize })) {
      newValue.shotedIds.set(reader.readInt32(), reader.readInt32())
    }

    return newValue
  },
  create() {
    return {
      shotedIds: new Map()
    }
  }
}

export const TimestampListener = engine.defineComponent(getNextComponentId(), TimestampListenerDef)
