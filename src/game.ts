import { createText } from './factory/text'
import { moveSystem } from './systems/moveZombie'
import { createOneShotComponentSystem } from './_internal/oneShotSystem'
import { gameLogicSystem } from './systems/game'
import { zombieSpawnSystem } from './systems/zombieSpawner'
import { zombieKiller } from './systems/zombieKiller'

engine.addSystem(createOneShotComponentSystem([engine.baseComponents.OnPointerDownResult._id]))

engine.addSystem(zombieSpawnSystem)
engine.addSystem(zombieKiller)

engine.addSystem(moveSystem)
engine.addSystem(gameLogicSystem)

createText('Click Cone to Play')
