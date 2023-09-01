import { InputAction, engine, pointerEventsSystem } from '@dcl/sdk/ecs'
import { changeColorSystem } from './systems'
import { getRealm } from '~system/Runtime'
import { isServer } from '~system/EngineApi'
import { createNetworkTransport } from '@dcl/sdk/network-transport'

import { setupUi } from './ui'
import { createCube } from './factory'


engine.addSystem(changeColorSystem)

export async function main() {
  const realm = await getRealm({})
  const serverUrl = realm.realmInfo?.isPreview ? 'ws://127.0.0.1:3000/ws' : 'wss://scene-state-server.decentraland.zone/ws'
  const networkEntityFactory = await createNetworkTransport(serverUrl)

  // draw UI
  setupUi(engine)

  if ((await isServer({})).isServer) {
    const entity = createCube(networkEntityFactory, 1, 1, 1)
    pointerEventsSystem.onPointerDown(
      { entity: entity, opts: { button: InputAction.IA_POINTER, hoverText: 'Spawn Sync cube' } },
      function () {
        createCube(networkEntityFactory, 1 + Math.random() * 8, Math.random() * 8, 1 + Math.random() * 8)
      }
    )
  }

}
