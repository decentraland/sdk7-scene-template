// We define the empty imports so the auto-complete feature works as expected.
import { } from '@dcl/sdk/math'
import { Animator, AudioSource, AvatarAttach, GltfContainer, Material, Transform, UiBackground, UiText, UiTransform, VideoPlayer, VisibilityComponent, engine, pointerEventsSystem } from '@dcl/sdk/ecs'

import { changeColorSystem, circularSystem } from './systems'
import { setupUi } from './ui'

export function main() {
  // Defining behavior. See `src/systems.ts` file.
  engine.addSystem(circularSystem)
  engine.addSystem(changeColorSystem)

  // draw UI. Here is the logic to spawn cubes.
  setupUi()
}
