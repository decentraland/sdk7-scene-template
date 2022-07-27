// TODO: use higher number so we dont have conflicts (i.e. > 2000)
const COMPONENT_ID = 2046

export type Vector3Type = {
  x:number,
  y:number,
  z:number
}

const Vector3EcsType = MapType({
  x: Float32,
  y: Float32,
  z: Float32
})

export type MoveTransportDataType = {
  hasFinished: boolean,
  duration: number,
  start: Vector3Type,
  end: Vector3Type,
  normalizedTime: number,
  lerpTime: number,
  speed: number,
  interpolationType: number 
}

const MoveTransportData = MapType({
  hasFinished: EcsBoolean,
  duration: Float32,
  start: Vector3EcsType,
  end: Vector3EcsType,
  normalizedTime: Float32,
  lerpTime: Float32,
  speed: Float32,
  interpolationType: Float32 // EcsInterpolation,
})

export const MoveTransformComponent = engine.defineComponent(COMPONENT_ID, MoveTransportData)
