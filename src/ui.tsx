import {
  engine,
  Transform,
} from '@dcl/sdk/ecs'
import { Color4 } from '@dcl/sdk/math'
import ReactEcs, { Label, ReactEcsRenderer, UiEntity } from '@dcl/sdk/react-ecs'

const uiComponent = () => (
  <UiEntity
    uiTransform={{
      width: 300,
      margin: { top: '90px', left: '300px' },
      padding: { top: 10, bottom: 10, left: 10, right: 10 }
    }}
    uiBackground={{ color: Color4.create(0.5, 0.8, 0.1, 0.6) }}
  >
    <UiEntity
      uiTransform={{
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex'
      }}
    >
      <Label
        value='SDK 7'
        fontSize={32}
        uiTransform={{height: 40}}
        uiBackground={{ color: Color4.fromHexString('#fbf0f0') }}
      />
    </UiEntity>
    <UiEntity
      uiTransform={{
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex'
      }}
    >
      <Label
        value={`Player: ${getPlayerPosition()}`}
        fontSize={18}
        uiTransform={{height: 40}}
        uiBackground={{ color: Color4.fromHexString('#fbf0f0') }}
      />
    </UiEntity>
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