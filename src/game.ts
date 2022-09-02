import {createAvatarShape, createAvatarShape2} from "./avatar";


function createCube(x: number, y: number, z: number, spawner = false): Entity {
  const entity = engine.addEntity()
  const entity2 = engine.addEntity()

  Transform.create(entity, {
    position: { x, y, z },
    scale: { x: 1, y: 1, z: 1 },
    rotation: { x: 0, y: 0, z: 0, w: 1 },
    parent: entity2
  })

  BoxShape.create(entity)
  
  CylinderShape.create(entity,{
    radiusTop:0
  })
  
  if (spawner) {
    OnPointerDown.create(entity, {
      button: ActionButton.PRIMARY,
      hoverText: 'Press E to spawn'
    })
  }

  return entity
}

function circularSystem(dt: number) {
  for (const [entity] of engine.getEntitiesWith(BoxShape, Transform)) {
    const transform = Transform.getMutable(entity)
    transform.rotation = Quaternion.multiply(transform.rotation, Quaternion.angleAxis(dt * 10, Vector3.Up()))
  }
}

let amount = 2
let totalTimePassed = 10
function danceSystem(dt: number) {
  totalTimePassed += dt
  if(totalTimePassed <= 10)
    return
  totalTimePassed = 0
  amount++
  for (const [entity] of engine.getEntitiesWith(AvatarShape, Transform)) {
    const avatarShape = AvatarShape.getMutable(entity)
    avatarShape.expressionTriggerId = 'disco'
    avatarShape.expressionTriggerTimestamp = amount
  }
}


function spawnerSystem() {
  const clickedCubes = engine.getEntitiesWith(BoxShape, OnPointerDownResult)
  amount++
  for (const [] of clickedCubes) {
    const avatarsShapes = engine.getEntitiesWith(AvatarShape)
    for (const [entity] of avatarsShapes) {
      const avatarShape = AvatarShape.getMutable(entity)
      avatarShape.talking = ! avatarShape.talking
      avatarShape.skinColor = {r: Math.random(), g:Math.random(), b:Math.random()}
      avatarShape.hairColor = {r: 1, g:1, b:1}
      avatarShape.expressionTriggerId = 'headexplode'
      avatarShape.expressionTriggerTimestamp = amount
    }
  }
}

createAvatarShape2(5,0,5)
createCube(8, 1, 8, true)
//engine.addSystem(circularSystem)
engine.addSystem(spawnerSystem)
engine.addSystem(danceSystem)
