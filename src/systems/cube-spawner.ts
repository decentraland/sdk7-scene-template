import { CubeIdentifierComponent } from '../components/cube'
import { createCube } from '../cube'

export function spawnerSystem() {
  const clickedCubes = engine.groupOf(CubeIdentifierComponent, OnPointerDownResult)
  for (const [_entity, _cube, pointerDownResult] of clickedCubes) {
    dcl.log(pointerDownResult.timestamp)
    createCube(Math.random() * 8 + 1, Math.random() * 8, Math.random() * 8 + 1, false)
  }
}
