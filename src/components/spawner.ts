const COMPONENT_ID = 2223

const SpawnerComponentType = MapType({
  lastPointerDownTs: Int32
})

export const SpawnerComponent = engine.defineComponent(COMPONENT_ID, SpawnerComponentType)
