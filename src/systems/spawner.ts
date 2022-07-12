import { SpawnerComponent } from '../components/spawner'
import { createCube } from '../cube'

const { OnPointerDownResult } = engine.baseComponents

export function spawnerSystem() {
  const clickedBoxShapes = engine.groupOf(SpawnerComponent, OnPointerDownResult)

  for (const [entity, spawner, pointerDownResult] of clickedBoxShapes) {
    dcl.log(pointerDownResult.timestamp)
    if (spawner.lastPointerDownTs !== pointerDownResult.timestamp) {
      SpawnerComponent.mutable(entity).lastPointerDownTs = pointerDownResult.timestamp
      createCube(Math.random() * 8 + 1, Math.random() * 8, Math.random() * 8 + 1, false)
    }
  }
}
