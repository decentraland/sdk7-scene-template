import { Schemas, engine } from '@dcl/sdk/ecs'

// We use this component to track and group all the cubes.
// engine.getEntitiesWith(Cube)
export const Cube = engine.defineComponent('cube-id', {})

// We use this component to track and group all the cubes.
// engine.getEntitiesWith(Cube)
export const Spinner = engine.defineComponent('spinner', { speed: Schemas.Number })