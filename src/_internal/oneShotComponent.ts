import { getNextComponentId } from '../components/customComponentIds'

export const OneShot = engine.defineComponent(getNextComponentId(), MapType({ ids: ArrayType(Int32) }))
