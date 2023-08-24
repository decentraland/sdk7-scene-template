import { InputAction, engine, pointerEventsSystem } from '@dcl/sdk/ecs'
import { bounceScalingSystem, changeColorSystem, circularSystem } from './systems'

import { setupUi } from './ui'
import { createCube } from './factory'
import { createNetworkServerTransport } from './network-transport'

// Defining behavior. See `src/systems.ts` file.
engine.addSystem(circularSystem)
engine.addSystem(bounceScalingSystem)
engine.addSystem(changeColorSystem)


export async function main() {
  createNetworkServerTransport()
  // draw UI
  setupUi()
  const entity = createCube(1, 1, 1)
  pointerEventsSystem.onPointerDown(
    { entity: entity, opts: { button: InputAction.IA_POINTER, hoverText: 'Spawn cube' } },
    function () {
      createCube(1 + Math.random() * 8, Math.random() * 8, 1 + Math.random() * 8)
    }
  )
}
