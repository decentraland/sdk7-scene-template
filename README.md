# ECS7 Test scene
This scene is built with the ECS7 in alpha state.

1. Run `npm i`
2. Run `npm start`


# ECS 7
## Entity
Entities are just an ID. It is an abstract concept not represented by any data structure. There is no "class Entity". Just a number.

```ts
const myEntity = engine.addEntity()
console.log(myEntity) // 100

// Remove Entity
engine.removeEntity(myEntity)
```

## Component
The component its a data container, WITHOUT any functions.
Its just data, and each component is assigned to an Entity.

### Well Known Components
```ts
const { Transform, GLFTShape } = engine.baseComponents
const entity = engine.addEntity()
Transfrom.create(entity, {
  position: { x: 12, y: 1, z: 12 },
  scale: { x: 1, y: 1, z: 1 },
  rotation: { x: 0, y: 0, z: 0, w: 1 }
})
GLTFShape.create(zombie, {
  withCollisions: true,
  isPointerBlocker: true,
  visible: true,
  src: 'models/zombie.glb'
})
```


### Custom Component
To create custom components we provide built-in-types that you MUST use in order to be able to serialize/deserialize those components.
```ts
const object = MapType({ x: Int32 }) // { x: 1 }
const array = ArrayType(Int32) // [1,2,3,4]
const objectArray = ArrayType(
  MapType({ x: Int32 })
) // [{ x: 1 }, { x: 2 }]
const BasicTypes = MapType({
  x: Int32,
  y: Float32,
  text: String,
  flag: Boolean
  }) // { x: 1, y: 1.412, text: 'ecs 7 text', flag: true }
const VelocityType = MapType({
  x: Float32,
  y: Float32,
  z: Float32
})
```

```ts
/**
 * OLD ECS
 */

// Define Coponent
@Component("velocity")
export class Velocity extends Vector3 {
  constructor(x: number, y: number, z: number) {
    super(x, y, z)
  }
}
// Create entity
const wheel = new Entity()

// Create instance of component with default values
wheel.addComponent(new WheelSpin())

/**
 * ECS 7
 */
// Define Component
const VelocityType = MapType({
  x: Float32,
  y: Float32,
  z: Float32
})
const COMPONENT_ID = 2008
const VelocityComponent = engine.deficneComponent(COMPONENT_ID, Velocity)
// Create Entity
const entity = engine.addEntity()

// Create instance of component
VelocityComponent.create(entity, { x: 1, y: 2.3, z: 8 })

// Remove instance of a component
VelocityComponenty.deleteFrom(entity)
```



## System
Systems are pure simple functions.
All your game logic comes here.
A system might hold data which is relevant to the system itself, but no data about the entities it processes

### Query components
The way to group/query the components inside systems is using the method groupOf. `engine.groupOf(...components)`.


```ts
function physicsSystem(dt: number) {
  const [entity, transform, velocity] = engine.groupOf(Transform, Velociy)
  // transform & velocity are read only components.
  if (transform.position.x === 10) {
    // To update a component, you need to call the `.mutable` method
    const mutableVelocity = VelocityComponent.mutable(entity)
    mutableVelocity.x += 1
  }
}

// Add system to the engine
engine.addSystem(physicsSystem)

// Remove system
engine.removeSystem(physicsSystem)
```

## Mutability
Mutability is now an important distinction.

We can choose to deal with mutable or with immutable versions of a component. We should use `mutable` only when we plan to make changes to a component.
This results in a huge gain in performance.