import { MoveTransformComponent } from "../components/moveTransport"
import { dogStates, NPComponent } from "../components/NPC"
import { PathDataComponent } from "../components/pathData"
import { TimeOutComponent } from "../components/timeOut"
import { Interpolate } from "../helper/interpolation"


export type Vector3Type = {
	x: number,
	y: number,
	z: number
  }

export function distanceSystem(dt: number) {
	const playerTransform = engine.baseComponents.Transform.getOrNull(1 as Entity)

	 if(playerTransform){
		for (const [entity, transform, npcData] of engine.groupOf(engine.baseComponents.Transform, NPComponent)) {
			const dist = getDistance(playerTransform.position, transform.position)

			if(dist < 5 && npcData.state !== dogStates.YELLING){
			
				changeState(entity, dogStates.YELLING)
		
			} else if(dist > 5 && npcData.state == dogStates.YELLING){

				previousState(entity)
			}
		}
	}
}


 
function getDistance(playerPos: Vector3Type, NPCPos:Vector3Type){
	const gap = Vector3.subtract(playerPos, NPCPos)

	return Vector3.length(gap)
}





export function walkAround(dt: number) {
	for (const [entity,  npcData] of engine.groupOf( NPComponent)) {
  
	switch(npcData.state) {
		case dogStates.WALKING:

			const move = MoveTransformComponent.mutable(entity)
			const transform = engine.baseComponents.Transform.mutable(entity)
		
			move.normalizedTime = Math.min(Math.max(move.normalizedTime + dt * move.speed, 0), 1)
			move.lerpTime = Interpolate(move.interpolationType, move.normalizedTime)
		
			// assign value to transform
			transform.position = Vector3.lerp(move.start, move.end, move.lerpTime)
		
			// has finished
			move.hasFinished = move.normalizedTime >= 1
		
			if (move.hasFinished) {
				changeState(entity, dogStates.TURNING)
			}
		break
		case dogStates.TURNING:

			const timer = TimeOutComponent.mutable(entity)

			timer.timeLeft = timer.timeLeft - dt
		
			// has finished
			timer.hasFinished = timer.timeLeft >= 0
		
			if (timer.hasFinished) {
				changeState(entity, dogStates.WALKING)	
			}
		break
	
	}	
	}
  }



export function changeState(entity:Entity, newState: dogStates){

	const npcDataMutable = NPComponent.mutable(entity)

	leaveState(entity, npcDataMutable.state)
	npcDataMutable.previousState = npcDataMutable.state
	npcDataMutable.state = newState

	enterState(entity, npcDataMutable.state)

}


export function previousState(entity:Entity){

	const npcDataMutable = NPComponent.mutable(entity)

	leaveState(entity, npcDataMutable.state)
	npcDataMutable.state = npcDataMutable.previousState

	enterState(entity, npcDataMutable.state)

}

export function enterState(entity:Entity, newState: dogStates){
	const animator = engine.baseComponents.Animator.mutable(entity)
	switch(newState) {
		case dogStates.WALKING:
			const walkAnim = animator.states.find( (anim) =>{return anim.name=="walk"})
			if(!walkAnim) return
			walkAnim.playing = true

			const move = MoveTransformComponent.getFrom(entity)
			if(move.hasFinished){
				nextSegment(entity)
			}
			break
		case dogStates.TURNING:
			const turnAnim = animator.states.find( (anim) =>{return anim.name=="turnRight"})
			if(!turnAnim) return
			turnAnim.playing = true

			const timer = TimeOutComponent.mutable(entity)
			if(timer.hasFinished){
				timer.timeLeft = 0.9
				timer.hasFinished = false
			}
			
			break
		case dogStates.YELLING:
			const raiseDeadAnim = animator.states.find( (anim) =>{return anim.name=="raiseDead"})
			if(!raiseDeadAnim) return
			raiseDeadAnim.playing = true
			break	
	}
}


export function leaveState(entity:Entity, oldState: dogStates){
	const animator = engine.baseComponents.Animator.mutable(entity)
	switch(oldState) {
		case dogStates.WALKING:
			const walkAnim = animator.states.find( (anim) =>{return anim.name=="walk"})
			if(!walkAnim) return
			walkAnim.playing = false

			break
		case dogStates.TURNING:
			const turnAnim = animator.states.find( (anim) =>{return anim.name=="turnRight"})
			if(!turnAnim) return
			turnAnim.playing = false
			
			break
		case dogStates.YELLING:
			const raiseDeadAnim = animator.states.find( (anim) =>{return anim.name=="raiseDead"})
			if(!raiseDeadAnim) return
			raiseDeadAnim.playing = false
			break	
	}
}



export  function nextSegment(gnark:Entity){

	let path = PathDataComponent.mutable(gnark)
	path.origin += 1
	path.target += 1
	if (path.target >= path.path.length) {
		path.target = 0
	} else if (path.origin >= path.path.length) {
		path.origin = 0
	}

	const move = MoveTransformComponent.mutable(gnark)
	
	move.start = path.path[path.origin],
	move.end = path.path[path.target],
	move.duration = 10
	move.normalizedTime = 0
	move.lerpTime = 0
	move.speed = 0.1
	move.hasFinished = false
	move.interpolationType = 1
		

	engine.baseComponents.Transform.mutable(gnark).rotation.y += 90
}