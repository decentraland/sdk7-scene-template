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


const _LIVES = 5
const _WINNING_SCORE = 15
const _SPAWN_INTERVAL = 3

// const zombie = createZombie(3)
// const _cubeEntity = createCube(2, 2, 8)
// addStateSystem(playSounds, { t: 0 })
// engine.addSystem(circularSystem)
engine.addSystem(moveSystem)
engine.addSystem(spawnerSystem)


export const coneEntity = createCone()

addClickBehavior(coneEntity, ()=>{
	dcl.log("STARTING GAME")


	if(GameControllerComponent.has(coneEntity)){
		if(!GameControllerComponent.getFrom(coneEntity).spawnActive){
			let controller = GameControllerComponent.mutable(coneEntity)
			controller.spawnActive = true
			controller.livesLeft = _LIVES
			controller.score = 0


			// clear NFTs
			const nfts = engine.groupOf(engine.baseComponents.NFTShape)
			for (const [entity, nftShape] of nfts){
				engine.removeEntity(entity)
			}

		} else return
	
	} else {
		GameControllerComponent.create(coneEntity,
			{
				spawnActive: true,
				livesLeft: _LIVES,
				score: 0,
				spawnCountDown: 0,
				spawnInterval: _SPAWN_INTERVAL,
				winningScore: _WINNING_SCORE,
				maxZombies: 10
			})
	}

	for ( let i =_LIVES; i >= 0 ; i-- )
	{
		const _nftEntity = createNft(i)

	}

	if(engine.baseComponents.AudioSource.has(coneEntity)){
		const source = engine.baseComponents.AudioSource.mutable(coneEntity)
		source.playing = true
	} else {
		engine.baseComponents.AudioSource.create(coneEntity,
			{
				audioClipUrl: "/sounds/ambient.mp3",
				loop: true,
				playing: true,
				pitch: 1,
				playedAtTimestamp: Date.now(),
				volume: 1
			})
	}

	

})

const textEntity = createText("Click Cone to Play")

