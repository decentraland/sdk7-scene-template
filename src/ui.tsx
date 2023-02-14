import {
  engine,
  Transform,
} from '@dcl/sdk/ecs'
import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Label, ReactEcsRenderer, UiEntity } from '@dcl/sdk/react-ecs'

const uiComponent = () => (
  <UiEntity
    uiTransform={{
      width: 400,
      height: 230,
      margin: { top: 16, left: 270 },
      padding: { top: 10, bottom: 10, left: 10, right: 10 },
      flexDirection: 'column',
    }}
    uiBackground={{ color: Color4.create(0.5, 0.8, 0.1, 0.6) }}
  >
    <Label
      value="SDK 7"
      fontSize={18}
      uiTransform={{ flexGrow: 1 }}
      uiBackground={{ color: Color4.fromHexString('#fbf0f03f') }}
    />
    <Label
      value={`Player: ${getPlayerPosition()}`}
      fontSize={18}
      uiTransform={{ width: '100%', height: 70 }}
      uiBackground={{ color: Color4.fromHexString('#fbf0f01f') }}
    />
  </UiEntity>
)

function getPlayerPosition() {
  const playerPosition = Transform.getOrNull(engine.PlayerEntity)
  if (!playerPosition) return ' no data yet'
  const { x, y, z } = playerPosition.position
  return `{X: ${x.toFixed(2)}, Y: ${y.toFixed(2)}, z: ${z.toFixed(2)} }`
}

export function setupUi() {
  ReactEcsRenderer.setUiRenderer(uiComponent)
}