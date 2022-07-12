import { GameControllerComponent } from './components/gameController'
import { MoveTransformComponent } from './components/moveTransport'
import { coneEntity } from './game'
import { addClickBehavior } from './systems/clickable'
import { onMoveZombieFinish } from './systems/moveZombie'
import { playSound } from './systems/sound'

const { Transform, GLTFShape } = engine.baseComponents

export function createZombie(xPos:number): Entity {
  const zombie = engine.addEntity()


  Transform.create(zombie, {
    position: { x: xPos, y: 1, z: 3 },
    scale: { x: 1, y: 1, z: 1 },
    rotation: { x: 0, y: 0, z: 0, w: 1 }
  })

  GLTFShape.create(zombie, {
    withCollisions: true,
    isPointerBlocker: true,
    visible: true,
    src: 'models/zombie.glb'
  })


  MoveTransformComponent.create(zombie, {
    start: { x: xPos, y: 1, z: 3 },
    end: { x: xPos, y: 1, z: 12 },
    duration: 6,
    normalizedTime: 0,
    lerpTime: 0,
    speed: 0.04,
    hasFinished: false,
    interpolationType: 1
  })


onMoveZombieFinish(zombie, () => {
	dcl.log('finished zombie', zombie)

	if( GameControllerComponent.has(coneEntity)){
		GameControllerComponent.mutable(coneEntity).livesLeft -=1
	  }

	  playSound(zombie)
  })
  
  addClickBehavior(zombie, ()=>{
	  dcl.log("BOOM!!!")

	  engine.removeEntity(zombie)
	  playSound(zombie)

	  if( GameControllerComponent.has(coneEntity)){
		GameControllerComponent.mutable(coneEntity).score +=1
	  }
  })

  return zombie
}
