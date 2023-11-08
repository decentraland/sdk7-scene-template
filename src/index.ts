// We define the empty imports so the auto-complete feature works as expected.
import { } from '@dcl/sdk/math'
import { Animator, AudioSource, AvatarAttach, GltfContainer, Transform, VisibilityComponent, engine, pointerEventsSystem } from '@dcl/sdk/ecs'
import { initAssetPacks } from '@dcl/asset-packs/dist/scene-entrypoint'

import { changeColorSystem, circularSystem } from './systems'
import { setupUi } from './ui'

export function main() {
  // You can remove this if you don't use any asset packs
  initAssetPacks(engine, pointerEventsSystem, {
    Animator,
    AudioSource,
    AvatarAttach,
    Transform,
    VisibilityComponent,
    GltfContainer
  })

  // Defining behavior. See `src/systems.ts` file.
  engine.addSystem(circularSystem)
  engine.addSystem(changeColorSystem)

  // draw UI. Here is the logic to spawn cubes.
  setupUi()
}
