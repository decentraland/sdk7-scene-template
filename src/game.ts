import { circularSystem } from './systems/circular'
import { playSounds } from './systems/sound'
import { addStateSystem } from './helper/systemWithState'
import { createCube } from './cube'
import { createCone } from './cone'
import { createNft } from './nft'
import { createText } from './text'
import { createZombie } from './zombie'
import { moveSystem, onMoveZombieFinish } from './systems/moveZombie'

const _cubeEntity = createCube(8, 2, 8)
const _coneEntity = createCone()
const _nftEntity = createNft()
const _textEntity = createText()
const zombie = createZombie()

onMoveZombieFinish(zombie, () => {
  dcl.log('finished zombie', zombie)
})

addStateSystem(circularSystem, { t: 0 })
addStateSystem(playSounds, { t: 0 })
engine.addSystem(moveSystem)
