type State = {
  t: number
}

export function playSounds(dt: number, state: State) {
  state.t += dt
  if (state.t < 4) {
    return
  }
  state.t = 0

  const entitiesWSound = engine.mutableGroupOf(engine.baseComponents.AudioSource)
  for (const [_entity, audioSource] of entitiesWSound) {
    audioSource.volume = 1
    audioSource.pitch = Math.random() * 5
    audioSource.playing = true
  }
}
