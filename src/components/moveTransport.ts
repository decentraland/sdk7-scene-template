// TODO: use higher number so we dont have conflicts (i.e. > 2000)
const COMPONENT_ID = 2046
const Vector3Schema = Schemas.Map({
  x: Schemas.Number,
  y: Schemas.Number,
  z: Schemas.Number
})

const MoveTransportData = Schemas.Map({
  hasFinished: Schemas.Boolean,
  duration: Schemas.Number,
  start: Vector3Schema,
  end: Vector3Schema,
  normalizedTime: Schemas.Number,
  lerpTime: Schemas.Number,
  speed: Schemas.Number,
  interpolationType: Schemas.Number // EcsInterpolation,
})

export const MoveTransformComponent = engine.defineComponent(COMPONENT_ID, MoveTransportData)
