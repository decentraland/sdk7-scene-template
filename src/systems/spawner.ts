import { SpawnerComponent } from '../components/spawner'
import { createCube } from '../cube'

const { OnPointerDownResult } = engine.baseComponents

export function spawnerSystem() {
  const clickedBoshapes = engine.groupOf(SpawnerComponent, OnPointerDownResult)

  for (const [entity, spawner, pointerDownResult] of clickedBoshapes) {
    dcl.log(pointerDownResult.timestamp)
    if (spawner.lastPointerDownTs !== pointerDownResult.timestamp) {
      SpawnerComponent.mutable(entity).lastPointerDownTs = pointerDownResult.timestamp
      createCube(Math.random() * 8 + 1, Math.random() * 8, Math.random() * 8 + 1, false)
    }
  }
}

// const lastPointerDownTsMap: Map<number, number> = new Map()

// export function spawnerSystem() {
//   const clickedBoshapes = engine.groupOf(OnPointerDownResult)

//   for (const [entity, pointerDownResult] of clickedBoshapes) {
//     dcl.log(pointerDownResult.timestamp)

//     const lastPointerDownTs = lastPointerDownTsMap.get(entity) || 0
//     if (lastPointerDownTs !== pointerDownResult.timestamp) {
//       createCube(Math.random() * 8 + 1, Math.random() * 8, Math.random() * 8 + 1, false)
//       lastPointerDownTsMap.set(entity, pointerDownResult.timestamp)
//     }
//   }
// }
