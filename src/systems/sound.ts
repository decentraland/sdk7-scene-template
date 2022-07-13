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


export function playSound(entity: Entity, soundPath: string, rndPitch?: boolean){

	const pitch = rndPitch?  (Math.random() * 3) + 0.3: 1


	if(
		engine.baseComponents.AudioSource.has(entity)
	){
		let source = engine.baseComponents.AudioSource.mutable(entity)
		source.audioClipUrl = soundPath,
		source.playedAtTimestamp = Date.now(),
		source.loop = false
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