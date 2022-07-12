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
		gameOver()
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
		playSound(entity)

	}

  }
}

engine.addSystem(zombieSpawnSystem)

// how do I pass the controller component as a param to this function????
function gameOver(){
	dcl.log("GAME OVER!!")

	if( GameControllerComponent.has(coneEntity)){
		GameControllerComponent.mutable(coneEntity).spawnActive = false
	  }
}


function win(){
	dcl.log("YOU WIN!!")
	GameControllerComponent.mutable(coneEntity).spawnActive = false
}

function spawnZombie(){

	let xPos = 2+  (Math.random() * 10)

	createZombie(xPos)
}
