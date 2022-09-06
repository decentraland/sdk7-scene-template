import {isPointerEventActive} from "@dcl/sdk/dist/ecs7";

function createCube(x: number, y: number, z: number, spawner = false): Entity {
  const entity = engine.addEntity()

  Transform.create(entity, {
    position: { x, y, z },
    scale: { x: 1, y: 1, z: 1 },
    rotation: { x: 0, y: 0, z: 0, w: 1 }
  })

  BoxShape.create(entity, {
    withCollisions: true,
    isPointerBlocker: true,
    visible: true,
    uvs: []
  })
  
  return entity
}

function createZombie(x: number, y: number, z: number, spawner = false): Entity {
  const entity = engine.addEntity()

  Transform.create(entity, {
    position: { x, y, z },
    scale: { x: 1, y: 1, z: 1 },
    rotation: { x: 0, y: 0, z: 0, w: 1 }
  })
  
  GLTFShape.create(entity, {
    withCollisions: true,
    isPointerBlocker: true,
    visible: true,
    src: 'models/zombie.glb'
  })
  
  if (spawner) {
    PointerEvents.create(entity, {
      pointerEvents: [
        {
          eventType: PointerEventType.DOWN,
          eventInfo: {
            button: ActionButton.PRIMARY,
            hoverText: 'Press click to spawn'
          }
        },
        {
          eventType: PointerEventType.UP,
          eventInfo: {
            button: ActionButton.PRIMARY,
            hoverText: 'Press click to spawn'
          }
        }]
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


function spawnerSystem() {
  const clickedCubes = engine.getEntitiesWith(GLTFShape)
  for (const [entity] of clickedCubes) {
    if(wasEntityClicked(entity, ActionButton.PRIMARY)){
      const material =  Material.getMutable(cube)
      material.albedoColor =  {
        r: Math.random(),
        g: Math.random(),
        b: Math.random()
      }
    }
  }
}

const entity = createZombie(8, 1, 8, true)
const cube = createCube(4, 1, 4, true)
const material = Material.create(cube, {
  albedoColor: {
    r: Math.random(),
    g: Math.random(),
    b: Math.random()
  } 
})
engine.addSystem(circularSystem)
engine.addSystem(spawnerSystem)
