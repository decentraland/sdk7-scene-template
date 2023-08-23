import {
  Entity,
  engine,
  Transform,
  MeshRenderer,
  MeshCollider,
  PointerEvents,
  PointerEventType,
  InputAction,
  Material,
  SyncEntity
} from '@dcl/sdk/ecs'
import { Cube, Door, Spinner } from './components'
import { Color4 } from '@dcl/sdk/math'
import { getRandomHexColor } from './utils'

// Cube factory
export function createCube(x: number, y: number, z: number, spawner = true): Entity {
  const entity = engine.addEntity()

  // Used to track the cubes
  Cube.create(entity)

  Transform.create(entity, { position: { x, y, z } })

  // set how the cube looks and collides
  MeshRenderer.setBox(entity)
  MeshCollider.setBox(entity)
  Material.setPbrMaterial(entity, { albedoColor: Color4.fromHexString(getRandomHexColor()) })

  Door.create(entity, { open: false })
  SyncEntity.create(entity, { componentIds: [Door.componentId, Material.componentId] })
  PointerEvents.create(entity, {
    pointerEvents: [
      { eventType: PointerEventType.PET_DOWN, eventInfo: { button: InputAction.IA_POINTER, hoverText: 'Change Color' } }
    ]
  })

  // Make the cube spin, with the circularSystem
  Spinner.create(entity, { speed: 10 * Math.random() })

  return entity
}
