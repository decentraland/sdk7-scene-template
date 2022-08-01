import { NPComponent } from "../components/NPC"
import { PathDataComponent } from "../components/pathData"
import { TimeOutComponent } from "../components/timeOut"


export type Vector3Type = {
	x: number,
	y: number,
	z: number
  }

export function distanceSystem(dt: number) {
	const playerTransform = engine.baseComponents.Transform.getOrNull(1 as Entity)

	 if(playerTransform){
		for (const [entity, transform] of engine.groupOf(engine.baseComponents.Transform, NPComponent)) {
			const dist = getDistance(playerTransform.position, transform.position)

			if(dist < 5){
				const animator = engine.baseComponents.Animator.mutable(entity)
				const raiseDead = animator.states.find( (anim) =>{return anim.name=="raiseDead"})
				if(raiseDead){
					raiseDead.playing = true
				}
						
				if(PathDataComponent.has(entity)){
					const pathData = PathDataComponent.mutable(entity)
					pathData.paused = true
				}

				if(TimeOutComponent.has(entity)){
					const timer = TimeOutComponent.mutable(entity)
					timer.paused = true
				}

				
			} 
		}
	}
}


 
function getDistance(playerPos: Vector3Type, NPCPos:Vector3Type){
	const gap = Vector3.subtract(playerPos, NPCPos)

	return Vector3.length(gap)
}

engine.addSystem(distanceSystem)