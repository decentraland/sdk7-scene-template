export function playSound(entity: Entity, soundPath: string, rndPitch?: boolean) {
  const pitch = rndPitch ? Math.random() * 3 + 0.3 : 1

  if (engine.baseComponents.AudioSource.has(entity)) {
    const source = engine.baseComponents.AudioSource.mutable(entity)
    ;(source.audioClipUrl = soundPath), (source.playedAtTimestamp = Date.now()), (source.loop = false)
    source.playing = true
    source.pitch = pitch
  } else {
    engine.baseComponents.AudioSource.create(entity, {
      audioClipUrl: soundPath,
      loop: false,
      pitch: pitch,
      playing: true,
      volume: 1,
      playedAtTimestamp: Date.now()
    })
  }
}
