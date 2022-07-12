
const COMPONENT_ID = 2066

const GameControlleType = MapType({
	spawnActive: EcsBoolean,
	spawnInterval: Int32,
	spawnCountDown: Int32,
	livesLeft: Int32,
	score: Int32,
	winningScore: Int32,
	maxZombies: Int32
  })


export const GameControllerComponent = engine.defineComponent(COMPONENT_ID, GameControlleType)
