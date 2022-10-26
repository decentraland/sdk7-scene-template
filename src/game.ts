import { createCube } from './factory'
import { bounceScaling, circularSystem, spawnerSystem } from './systems'

// Initial function executed when scene is evaluated.
function setup() {
  // Defining behaviour. See `src/systems.ts` file.
  engine.addSystem(circularSystem)
  engine.addSystem(spawnerSystem)
  engine.addSystem(bounceScaling)

  // Create my main cube and color it.
  const cube = createCube(8, 1, 8)
  Material.create(cube, { albedoColor: Color3.fromHexString('#FFD96C') })
}

setup()
