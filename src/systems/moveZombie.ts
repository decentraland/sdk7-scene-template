import { MoveTransformComponent, MoveTransformFinishedComponent } from '../components/moveTransport'
import { ZombieComponent } from '../components/zombie'
import { playSound } from '../factory/sound'
import { Interpolate } from '../helper/interpolation'
import { ensureGameController } from './game'

const { Transform } = engine.baseComponents

export function moveSystem(dt: number) {
  for (const [entity, move, transform] of engine.mutableGroupOf(MoveTransformComponent, Transform, ZombieComponent)) {
    move.normalizedTime = Math.min(Math.max(move.normalizedTime + dt * move.speed, 0), 1)
    move.lerpTime = Interpolate(move.interpolationType, move.normalizedTime)

    // assign value to transform
    transform.position = Vector3.lerp(move.start, move.end, move.lerpTime)

    const hasFinished = move.normalizedTime >= 1
    if (hasFinished) {
      MoveTransformComponent.deleteFrom(entity)
      MoveTransformFinishedComponent.create(entity)
    }
  }

  for (const [zombieEntity] of engine.groupOf(MoveTransformFinishedComponent, Transform, ZombieComponent)) {
    dcl.log('finished zombie', zombieEntity)
    ensureGameController().livesLeft -= 1

    const animator = engine.baseComponents.Animator.mutable(zombieEntity)
    const walkAnim = animator.states[0] // animator.states.find( (anim) =>{anim.clip=="Walking"})
    const attackAnim = animator.states[1] //animator.states.find( (anim) =>{anim.clip=="Attacking"})
    if (walkAnim && attackAnim) {
      walkAnim.playing = false
      walkAnim.loop = false
      attackAnim.playing = true
      attackAnim.loop = true
    }

    const nfts = engine.groupOf(engine.baseComponents.NFTShape)

    //only remove first
    for (const [entity] of nfts) {
      engine.removeEntity(entity)
      break
    }

    playSound(zombieEntity, 'sounds/attack.mp3', true)
    MoveTransformFinishedComponent.deleteFrom(zombieEntity)
  }
}
