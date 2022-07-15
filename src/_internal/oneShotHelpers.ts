import { OneShot } from './oneShotComponent'

export function* groupOfShotedComponent<T extends [ComponentDefinition]>(
  ...component: T
): Iterable<[Entity, DeepReadonly<ComponentEcsType<T>>]> {
  for (const [entity, oneShot, componentValue] of engine.groupOf(OneShot, ...component)) {
    if (component.every((componentItem) => oneShot.ids.find((shotedId) => shotedId === componentItem._id))) {
      yield [entity, componentValue]
    }
  }
}

export function isShoted<T extends [ComponentDefinition]>(entity: Entity, ...components: T) {
  const oneShot = OneShot.getOrNull(entity)
  if (oneShot) {
    return components.every((componentItem) => oneShot.ids.find((shotedId) => shotedId === componentItem._id))
  } else {
    return false
  }
}
