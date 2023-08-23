import {
  engine,
  Transform,
  inputSystem,
  Material,
  InputAction,
  PointerEventType,
  PointerEvents,
} from '@dcl/sdk/ecs'
import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import { BounceScaling, Door, Spinner } from './components'
import { getRandomHexColor } from './utils'


/**
 * All cubes rotating behavior
 */
export function circularSystem(dt: number) {
  const entitiesWithSpinner = engine.getEntitiesWith(Spinner, Transform)
  for (const [entity, _spinner, _transform] of entitiesWithSpinner) {
    const mutableTransform = Transform.getMutable(entity)
    const spinnerData = Spinner.get(entity)

    mutableTransform.rotation = Quaternion.multiply(
      mutableTransform.rotation,
      Quaternion.fromAngleAxis(dt * spinnerData.speed, Vector3.Up())
    )
  }
}


/**
 * Add this system and every entity with BounceScaling will bounce for 5 seconds
 * @param dt - detal time in seconds
 */
export function bounceScalingSystem(dt: number) {
  const clickedCubes = engine.getEntitiesWith(BounceScaling, Transform)
  for (const [entity] of clickedCubes) {
    const m = BounceScaling.getMutable(entity)
    m.t += dt

    if (m.t > 5) {
      Transform.getMutable(entity).scale = Vector3.One()
      BounceScaling.deleteFrom(entity)
    } else {
      const factor = 0.9 + 0.2 * Math.exp(-1.5 * m.t) * Math.sin(10 * m.t)
      Transform.getMutable(entity).scale = Vector3.scale(Vector3.One(), factor)
    }
  }
}


export function changeColorSystem() {
  for (const [entity] of engine.getEntitiesWith(Door, PointerEvents)) {
    if (inputSystem.isTriggered(InputAction.IA_POINTER, PointerEventType.PET_DOWN, entity)) {
      Material.setPbrMaterial(entity, { albedoColor: Color4.fromHexString(getRandomHexColor()) })
      const door = Door.getMutable(entity)
      door.open = !door.open
      console.log(`The door was ${door.open ? 'opened' : 'closed'}`)
    }
  }
}
