import { COMPONENT_MGR } from "./CustomComponentIdMgr"

// TODO: use higher number so we dont have conflicts (i.e. > 2000)
const COMPONENT_ID = COMPONENT_MGR.generateId()

//explcitly define types so can type varaibles
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

//explcitly define types so can type varaibles. const myVar:MoveTransportDataType
//would be cool if somehow the Spec worked as a type or could derrive one from the other
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
