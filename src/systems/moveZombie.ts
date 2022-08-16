import { MoveTransformComponent } from '../components/moveTransport'
import { Interpolate } from '../helper/interpolation'

export function moveSystem(dt: number) {
  for (const [entity, move, transform] of engine.mutableGroupOf(MoveTransformComponent, Transform)) {
    move.normalizedTime = Math.min(Math.max(move.normalizedTime + dt * move.speed, 0), 1)
    move.lerpTime = Interpolate(move.interpolationType, move.normalizedTime)

    // assign value to transform
    transform.position = Vector3.lerp(move.start, move.end, move.lerpTime)

    // has finished
    move.hasFinished = move.normalizedTime >= 1

    if (move.hasFinished) {
      MoveTransformComponent.deleteFrom(entity)
    }
  }
}
