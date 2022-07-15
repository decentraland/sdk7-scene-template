import { GameControllerComponent } from '../components/gameController'
import { createCone } from '../factory/cone'
import { createNft } from '../factory/nft'

const _LIVES = 5
const _WINNING_SCORE = 15
const _SPAWN_INTERVAL = 3

const gameEntity = engine.addEntity()
const coneStarterEntity = createCone()

export function ensureGameController() {
  if (GameControllerComponent.has(gameEntity)) {
    return GameControllerComponent.mutable(gameEntity)
  } else {
    return GameControllerComponent.create(gameEntity)
  }
}

function triggerGameStart() {
  const gameController = ensureGameController()

  if (gameController.spawnActive) {
    gameController.spawnActive = true
    gameController.livesLeft = _LIVES
    gameController.score = 0

    // clear NFTs
    const nfts = engine.groupOf(engine.baseComponents.NFTShape)
    for (const [entity, _nftShape] of nfts) {
      engine.removeEntity(entity)
    }

    return
  }

  Object.assign(gameController, {
    spawnActive: true,
    livesLeft: _LIVES,
    score: 0,
    spawnCountDown: 0,
    spawnInterval: _SPAWN_INTERVAL,
    winningScore: _WINNING_SCORE,
    maxZombies: 10
  })

  for (let i = _LIVES; i >= 0; i--) {
    const _nftEntity = createNft(i)
  }

  // TODO:
  // if (engine.baseComponents.AudioSource.has(gameEntity)) {
  //   const source = engine.baseComponents.AudioSource.mutable(gameEntity)
  //   source.playing = true
  // } else {
  //   engine.baseComponents.AudioSource.create(gameEntity, {
  //     audioClipUrl: '/sounds/ambient.mp3',
  //     loop: true,
  //     playing: true,
  //     pitch: 1,
  //     playedAtTimestamp: Date.now(),
  //     volume: 1
  //   })
  // }
}

export function gameLogicSystem() {
  if (engine.baseComponents.OnPointerDownResult.has(coneStarterEntity)) {
    triggerGameStart()
  }
}
