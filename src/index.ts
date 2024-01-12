// We define the empty imports so the auto-complete feature works as expected.
import { } from '@dcl/sdk/math'
import { Animator, AudioSource, AvatarAttach, GltfContainer, Material, NetworkEntity, SyncComponents, Transform, Tween, VideoPlayer, VisibilityComponent, engine, pointerEventsSystem } from '@dcl/sdk/ecs'
import { initAssetPacks } from '@dcl/asset-packs/dist/scene-entrypoint'
import { syncEntity } from '@dcl/sdk/network'

syncEntity

// You can remove this if you don't use any asset packs
initAssetPacks(engine, pointerEventsSystem, {
  Animator,
  AudioSource,
  AvatarAttach,
  Transform,
  VisibilityComponent,
  GltfContainer,
  Material,
  VideoPlayer
})

export function main() {
  for (const entities of engine.getEntitiesWith(SyncComponents)) {
    console.log('ENTITIES asd: ', entities)
  }

  // syncEntity(514 as any, [Tween.componentId], 123)
  const componentIds = SyncComponents.getMutable(516 as any).componentIds
  componentIds.push(Tween.componentId)
  SyncComponents.createOrReplace(516 as any, { componentIds })
}
