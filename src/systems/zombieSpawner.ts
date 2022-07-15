import { createZombie } from '../factory/zombie'
import { ensureGameController } from './game'

// how do I pass the controller component as a param to this function????
function lose() {
  dcl.log('GAME OVER!!')
  endGame()
}

function win() {
  dcl.log('YOU WIN!!')
  endGame()
}

function spawnZombie() {
  const xPos = 2 + Math.random() * 10
  return createZombie(xPos)
}

function endGame() {
  ensureGameController().spawnActive = false

  // TODO:
  // if (engine.baseComponents.AudioSource.has(coneEntity)) {
  //   engine.baseComponents.AudioSource.mutable(coneEntity).playing = false
  // }
}

export function zombieSpawnSystem(dt: number) {
  const controller = ensureGameController()

  if (!controller.spawnActive) {
    return
  }

  if (controller.livesLeft <= 0) {
    lose()
  } else if (controller.score >= controller.winningScore) {
    win()
  }

  controller.spawnCountDown -= dt
  if (controller.spawnCountDown < 0) {
    controller.spawnCountDown = controller.spawnInterval
    dcl.log('SPAWNING NEW ZOMBIE ', spawnZombie())
    // TODO:
    // playSound(game, 'sounds/pickUp.mp3', true)
  }
}
