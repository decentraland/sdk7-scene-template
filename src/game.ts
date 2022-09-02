function createCube(x: number, y: number, z: number, spawner = false): Entity {
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
      pointerEvents: [{eventType: PointerEventType.DOWN,
        eventInfo: {
          button: ActionButton.PRIMARY,
          hoverText: 'Press E to spawn'
        }
      },
        {eventType: PointerEventType.UP,
          eventInfo: {
            button: ActionButton.PRIMARY,
            hoverText: 'Press E to spawn'
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
  const clickedCubes = engine.getEntitiesWith(BoxShape)
  for (const [entity] of clickedCubes) {
    if(wasEntityClicked(entity,ActionButton.PRIMARY))
      createCube(Math.random() * 8 + 1, Math.random() * 8, Math.random() * 8 + 1)
  }
}


createCube(8, 1, 8, true)
engine.addSystem(circularSystem)
engine.addSystem(spawnerSystem)
