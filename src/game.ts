import { circularSystem } from './systems/circular'
import { playSounds } from './systems/sound'
import { addStateSystem } from './helper/systemWithState'
import { createCube } from './cube'
import { createCone } from './cone'
import { createNft } from './nft'
import { createText } from './text'
import { createZombie } from './zombie'
import { moveSystem, onMoveZombieFinish } from './systems/moveZombie'
import { spawnerSystem } from './systems/spawner'
import { addClickBehavior } from './systems/clickable'
import { MoveTransformComponent } from './components/moveTransport'
import { GameControllerComponent } from './components/gameController'

const _cubeEntity = createCube(2, 2, 8)

const _nftEntity = createNft()

// const zombie = createZombie(3)
// const zombie2 = createZombie(4)
// const zombie3 = createZombie(5)
// const zombie4 = createZombie(6)
// const zombie5 = createZombie(7)


// addStateSystem(playSounds, { t: 0 })
engine.addSystem(circularSystem)
engine.addSystem(moveSystem)
engine.addSystem(spawnerSystem)


export const coneEntity = createCone()

addClickBehavior(coneEntity, ()=>{
	dcl.log("STARTING GAME")


	if(GameControllerComponent.has(coneEntity)){
		if(!GameControllerComponent.getFrom(coneEntity).spawnActive){
			let controller = GameControllerComponent.mutable(coneEntity)
			controller.spawnActive = true
			controller.livesLeft = 5
			controller.score = 0
		} else return
	
	} else {
		GameControllerComponent.create(coneEntity,
			{
				spawnActive: true,
				livesLeft: 5,
				score: 0,
				spawnCountDown: 0,
				spawnInterval: 3,
				winningScore: 15,
				maxZombies: 10
			})
	}



}





)

const textEntity = createText("Click Cone to Play")

