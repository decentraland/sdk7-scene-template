import { ZombieComponent } from '../components/zombie'
import { ensureGameController } from './game'

export function zombieKiller() {
  for (const [zombieEntity] of engine.groupOf(ZombieComponent)) {
    if (engine.baseComponents.OnPointerDownResult.has(zombieEntity)) {
      dcl.log('BOOM!!! ', zombieEntity)

      engine.removeEntity(zombieEntity)
      // TODO:
      // playSound(zombie, 'sounds/explosion.mp3', true)
      ensureGameController().score += 1
    }
  }
}
