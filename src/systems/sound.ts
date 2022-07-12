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
    audioSource.playedAtTimestamp = Date.now()
    audioSource.pitch = Math.random() * 5
    audioSource.playing = true
  }
}


export function playSound(entity: Entity){

	if(
		engine.baseComponents.AudioSource.has(entity)
	){
		let source = engine.baseComponents.AudioSource.mutable(entity)
		source.playedAtTimestamp = Date.now(),
		source.playing = true
		source.pitch = Math.random() * 5

	} else {
		engine.baseComponents.AudioSource.create(entity, {
			audioClipUrl: 'sounds/pickUp.mp3',
			loop: false,
			pitch: Math.random() * 5,
			playing: true,
			volume: 1,
			playedAtTimestamp: Date.now()
		  })
	}

}