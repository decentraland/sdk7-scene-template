import { ZombieComponent } from '../components/zombie'
import { isShoted } from '../_internal/oneShotHelpers'
import { ensureGameController } from './game'

export function zombieKiller() {
  for (const [zombieEntity] of engine.groupOf(ZombieComponent)) {
    if (isShoted(zombieEntity, engine.baseComponents.OnPointerDownResult)) {
      dcl.log('BOOM!!! ', zombieEntity)

      engine.removeEntity(zombieEntity)
      // TODO:
      // playSound(zombie, 'sounds/explosion.mp3', true)
      ensureGameController().score += 1
    }
  }
}
