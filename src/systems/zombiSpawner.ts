import { GameControllerComponent } from '../components/gameController'
import { MoveTransformComponent } from '../components/moveTransport'
import { createCube } from '../cube'
import { coneEntity } from '../game'
import { createZombie } from '../zombie'
import { playSound } from './sound'





export function zombieSpawnSystem(dt:number) {
	

  const gameControllers = engine.groupOf(GameControllerComponent)

  for (const [entity, controller] of gameControllers) {
	if(!controller.spawnActive) return

	if(controller.livesLeft <= 0){
		lose()
	} else if (controller.score >= controller.winningScore){
		win()
	} 
	//else if(controller.maxZombies < engine.groupOf(MoveTransformComponent)){
			// TOO MANY ZOMBIES
	//}

	let mutableController = GameControllerComponent.mutable(entity)
	mutableController.spawnCountDown -= dt
	if(mutableController.spawnCountDown < 0){
		mutableController.spawnCountDown = mutableController.spawnInterval
		dcl.log("SPAWNING NEW ZOMBIE")
		spawnZombie()
		playSound(entity, 'sounds/pickUp.mp3', true)

	}

  }
}

engine.addSystem(zombieSpawnSystem)

// how do I pass the controller component as a param to this function????
function lose(){
	dcl.log("GAME OVER!!")
	endGame()
}


function win(){
	dcl.log("YOU WIN!!")
	endGame()
}

function spawnZombie(){

	let xPos = 2+  (Math.random() * 10)

	createZombie(xPos)
}

function endGame(){
	if( GameControllerComponent.has(coneEntity)){
		GameControllerComponent.mutable(coneEntity).spawnActive = false
	  }

	  if( engine.baseComponents.AudioSource.has(coneEntity)){
		engine.baseComponents.AudioSource.mutable(coneEntity).playing = false
	  }
}