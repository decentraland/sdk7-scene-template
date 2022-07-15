import { OneShot } from './oneShotComponent'
import { TimestampListener, TimestampListenerType } from './timestampListenerComponent'

export function createOneShotComponentSystem(componentIds: number[]) {
  return function oneShotComponentSystem(_dt: number) {
    // First clear all OneShot that exist
    for (const [entity] of engine.groupOf(OneShot)) {
      OneShot.deleteFrom(entity)
    }

    // Update each
    for (const componentId of componentIds) {
      for (const [entity, component] of engine.groupOf(engine.getComponent(componentId))) {
        const readonlyTimestampListener = TimestampListener.getOrNull(entity) as any as TimestampListenerType
        const lastTimestamp = readonlyTimestampListener?.shotedIds.get(componentId) || -1
        const currentTimestamp = (component.timestamp as unknown as number) || -1

        if (currentTimestamp !== lastTimestamp) {
          if (readonlyTimestampListener === null) {
            TimestampListener.create(entity).shotedIds.set(componentId, currentTimestamp)
          } else {
            TimestampListener.mutable(entity).shotedIds.set(componentId, currentTimestamp)
          }

          if (OneShot.getOrNull(entity) === null) {
            OneShot.create(entity, { ids: [componentId] })
          } else {
            OneShot.mutable(entity).ids.push(componentId)
          }
        }
      }
    }
  }
}
