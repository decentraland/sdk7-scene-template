import { createCube } from '../cube'

const { OnPointerDownResult } = engine.baseComponents


const callbackMap = new Map<Entity, (entity:Entity) => void>()


export const ClickableComponent = engine.defineComponent(
  3000,
  MapType({
    lastPointerDownTs: Int32
  })
)

export function clickedSystem(dt: number) {
  const clickedBoshapes = engine.groupOf(ClickableComponent, OnPointerDownResult)

  for (const [entity, clickable, pointerDownResult] of clickedBoshapes) {
     if ( clickable.lastPointerDownTs !== pointerDownResult.timestamp) {

		const fn = callbackMap.get(entity)
		if (fn) fn(entity)

		ClickableComponent.mutable(entity).lastPointerDownTs = pointerDownResult.timestamp

		//engine.baseComponents.OnPointerDownResult.deleteFrom(entity)
		
     }
  }
}

engine.addSystem(clickedSystem)

export function addClickBehavior (entity:Entity, fn:(entity:Entity) => void ) {

	engine.baseComponents.OnPointerDown.create(entity, {
		button: 0,
		distance: 100,
		hoverText: "click",
		showFeedback: true
	})
	callbackMap.set(entity, fn)
	
	ClickableComponent.create(entity)

	return entity
}
