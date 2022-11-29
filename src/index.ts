import { engine, Material } from '@dcl/sdk/ecs'
import { Color3 } from '@dcl/sdk/math'

import { createCube } from './factory'
import { bounceScaling, circularSystem, spawnerSystem } from './systems'

export * from '@dcl/sdk'

// Initial function executed when scene is evaluated.
export async function onStart() {
  // Defining behaviour. See `src/systems.ts` file.
  engine.addSystem(circularSystem)
  engine.addSystem(spawnerSystem)
  engine.addSystem(bounceScaling)

  // Create my main cube and color it.
  const cube = createCube(8, 1, 8)
  Material.create(cube, { material: { $case: 'pbr', pbr: { albedoColor: Color3.fromHexString('#FFD96C') } } })
}
