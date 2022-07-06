import { createCube } from '../cube'

const { OnPointerDownResult } = engine.baseComponents

const SpawnerComponentId = 2223
export const SpawnerComponent = engine.defineComponent(
  SpawnerComponentId,
  MapType({
    lastPointerDownTs: Int32
  })
)

export function spawnerSystem() {
  const clickedBoshapes = engine.groupOf(SpawnerComponent, OnPointerDownResult)

  for (const [entity, spawner, pointerDownResult] of clickedBoshapes) {
    if (spawner.lastPointerDownTs !== pointerDownResult.timestamp) {
      SpawnerComponent.mutable(entity).lastPointerDownTs = pointerDownResult.timestamp
      createCube(Math.random() * 8 + 1, Math.random() * 8, Math.random() * 8 + 1, false)
    }
  }
}
