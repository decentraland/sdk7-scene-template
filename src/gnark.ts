// Coordinates of path to patrol
import {  Vector3EcsType } from "components/VectorType"

const point1 = {x:8, y:0, z:8}
const point2 = {x:8, y:0, z:24}
const point3 = {x:24,y: 0,z: 24}
const point4 = {x:24,y: 0,z: 8}
//  const path: Vector3EcsType[] = [point1, point2, point3, point4]


const TURN_TIME = 0.9


const { Transform, GLTFShape } = engine.baseComponents
import { MoveTransformComponent } from './components/moveTransport'
import { PathDataComponent } from './components/pathData'
import { TimeOutComponent } from "./components/timeOut"
import { onMoveFinish } from "./systems/moveSystem"
import { onTimeUp } from "./systems/timeOutSystem"


export function createGnark(): Entity {
	const gnark = engine.addEntity()
  
	Transform.create(gnark, {
	  position: point1,
	  scale: { x: 1, y: 1, z: 1 },
	  rotation: { x: 0, y: 0, z: 0, w: 1 }
	})


	
  
	GLTFShape.create(gnark, {
	  withCollisions: true,
	  isPointerBlocker: true,
	  visible: true,
	  src: 'models/gnark.glb'
	})

	engine.baseComponents.Animator.create(gnark, {states:[{
		name: "walk",
		clip: "walk",
		playing: true,
		weight: 1,
		speed: 1,
		loop: true,
		shouldReset: false
	}, {
		name: "turnRight",
		clip: "turnRight",
		playing: false,
		weight: 1,
		speed: 1,
		loop: false,
		shouldReset: true
	},
	{
		name: "raiseDead",
		clip: "raiseDead",
		playing: false,
		weight: 1,
		speed: 1,
		loop: true,
		shouldReset: false
	}
]})


	PathDataComponent.create(gnark,{
		path: [point1, point2, point3, point4],
		paused: false,
		origin: 0,
		target: 1
	})
  
	MoveTransformComponent.create(gnark, {
	  start: point1,
	  end: point2,
	  duration: 5,
	  normalizedTime: 0,
	  lerpTime: 0,
	  speed: 0.1,
	  hasFinished: false,
	  interpolationType: 1
	})

	onMoveFinish(gnark, () => {

		const animator = engine.baseComponents.Animator.mutable(gnark)

		// const walkAnim = animator.states.find( (anim) =>{anim.name=="walk"})
		// const turnAnim = animator.states.find( (anim) =>{anim.name=="turnRight"})

		const walkAnim = animator.states[0]
		const turnAnim = animator.states[1]


		if(!walkAnim || !turnAnim) return

		walkAnim.playing = false
		turnAnim.playing = true

		TimeOutComponent.create(gnark, {
			timeLeft:0.9,
			hasFinished: false
		})


		onTimeUp(gnark, ()=>{
			walkAnim.playing = true
			turnAnim.playing = false
			nextSegment(gnark)
		})

		
	  })

  
	return gnark
  }

  
  function nextSegment(gnark:Entity){

	let path = PathDataComponent.mutable(gnark)
		path.origin += 1
		path.target += 1
		if (path.target >= path.path.length) {
			path.target = 0
		  } else if (path.origin >= path.path.length) {
			path.origin = 0
		  }
	
		  MoveTransformComponent.create(gnark, {
			start: path.path[path.origin],
			end: path.path[path.target],
			duration: 10,
			normalizedTime: 0,
			lerpTime: 0,
			speed: 0.1,
			hasFinished: false,
			interpolationType: 1
		  })
	
		  engine.baseComponents.Transform.mutable(gnark).rotation.y += 90
  }