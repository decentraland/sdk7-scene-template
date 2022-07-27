// TODO: use higher number so we dont have conflicts (i.e. > 2000)

export class CustomComponentIdMgr {
  componentName2IdMap: Record<string, number> = {}

  // TODO: use higher number so we dont have conflicts (i.e. > 2000)
  componentIdSeq: number = 4444

  generateId() {
    return this.componentIdSeq++
  }

  //not sure its worth wrapping the engine define?
  defineComponent<T extends EcsType>(componentName: string, spec: T): ComponentDefinition<T> {
    const id = this.generateId()
    const comp = engine.defineComponent(id, spec)
    this.register(id, componentName, comp)
    return comp
  }

  register(id: number, componentName: string, comp: ComponentDefinition) {
    this.componentName2IdMap[componentName] = id
  }

  getComponentId(componentName: string) {
    return this.componentName2IdMap[componentName]
  }
}

export const COMPONENT_MGR = new CustomComponentIdMgr()
