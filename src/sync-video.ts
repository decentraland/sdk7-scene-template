  // Player.create(currentPlayerEntity)
  // syncEntity(currentPlayerEntity, [Player.componentId], 3002)

  // // #1
  // const screen = engine.addEntity()
  // MeshRenderer.setPlane(screen)
  // Transform.create(screen, { position: { x: 4, y: 1, z: 4 } })

  // // #2
  // VideoPlayer.create(screen, {
  //   src: 'https://player.vimeo.com/external/552481870.m3u8?s=c312c8533f97e808fccc92b0510b085c8122a875',
  //   playing: true,
  //   position: 0
  // })

  // // #3
  // const videoTexture = Material.Texture.Video({ videoPlayerEntity: screen })

  // // #4
  // Material.setPbrMaterial(screen, {
  //   texture: videoTexture,
  //   roughness: 1.0,
  //   specularIntensity: 0,
  //   metallic: 0,
  // })

  // // MessageBus Video sync OOTB
  // // PoC for 1 video screen entity.
  // const messageBus = new MessageBus()
  // messageBus.emit('ready', {})
  // messageBus.on('ready', (_, sender) => {
  //   if (sender === 'self') return
  //   // const network = NetworkEntity.get(screen)
  //   messageBus.emit('SyncVideo', { currentOffset: (Date.now() - startedAt) / 1000 })
  // })

  // messageBus.on('SyncVideo', (value, sender) => {
  //   if (sender === 'self') return
  //   VideoPlayer.getMutable(screen).position = value.currentOffset
  // })

  // // We dont have the currentOffset so we must track this info
  // let currentOffset = 0
  // let startedAt: number

  // videoEventsSystem.registerVideoEventsEntity(screen, (event) => {
  //   if (event.state === VideoState.VS_PLAYING) {
  //     startedAt = Date.now()
  //   }
  //   if (event.state === VideoState.VS_PAUSED) {
  //     currentOffset = event.currentOffset
  //     startedAt = 0
  //   }
  // })