import { AvatarBase, engine, PlayerIdentityData } from '@dcl/sdk/ecs'
import { createCube } from './factory'
import { setupUi } from './ui'
import { changeColorSystem, circularSystem } from './systems'

export async function main() {
  engine.addSystem(changeColorSystem)
  engine.addSystem(circularSystem)

  createCube(2, 1, 2, 1)

  setupUi()
}
