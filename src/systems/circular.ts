export function circularSystem(dt: number) {
  const entitiesWithBoxShapes = engine.groupOf(BoxShape, Transform)
  for (const [entity, _boxShape, _transform] of entitiesWithBoxShapes) {
    const mutableTransform = Transform.mutable(entity)

    mutableTransform.rotation = Quaternion.multiply(
      mutableTransform.rotation,
      Quaternion.angleAxis(dt * 10, Vector3.Up())
    )
  }
}
