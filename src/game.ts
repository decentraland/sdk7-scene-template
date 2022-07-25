
import { createHummingBird } from "./hummingBird"


const ground = engine.addEntity()
engine.baseComponents.Transform.create(ground, {
	position: {x:8, y:0, z:8},
	rotation: {x:0, y:0, z:0, w: 0},
	scale:  {x:1.6, y:1.6, z:1.6}
})
engine.baseComponents.GLTFShape.create(ground, {
	src:'models/Ground.gltf',
	isPointerBlocker: true,
	visible: true,
	withCollisions: true
})



const tree = engine.addEntity()
engine.baseComponents.Transform.create(tree, {
	position: {x:8, y:0, z:8},
	rotation: {x:0, y:0, z:0, w: 0},
	scale:  {x:1.6, y:1.6, z:1.6}
})
engine.baseComponents.GLTFShape.create(tree, {
	src:'models/Tree.gltf',
	isPointerBlocker: true,
	visible: true,
	withCollisions: true
})
engine.baseComponents.Animator.create(tree, {
	states:[
		{
			clip: "Tree_Action",
			loop: false,
			playing: false,
			shouldReset: true,
			speed: 1,
			weight: 1,
			name: "Tree_Action" 
		}
	]
})
engine.baseComponents.OnPointerDown.create(tree, {
	button: 0,
	distance: 15,
	hoverText: "Shake",
	showFeedback: true
})


export function clickTree(){
	if(engine.baseComponents.OnPointerDownResult.has(tree)){
		createHummingBird()
		let anim = engine.baseComponents.Animator.mutable(tree)
		anim.states[0].playing = true
	}
}

engine.addSystem(clickTree)