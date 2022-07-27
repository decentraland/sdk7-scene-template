/**
 * attempt at sdk 6.x like syntax
 */
export class EntityWrapper{
    entity:Entity

    constructor(entity:Entity){
        this.entity = entity
    }

    getComponent<T extends EcsType = EcsType<any>>(comp:ComponentDefinition<T>):ComponentType<T>{
        return this.getComponentM(comp)
    }

    getComponentM<T extends EcsType = EcsType<any>>(comp:ComponentDefinition<T>):ComponentType<T>{
        //if(mutable===undefined || mutable){
            return comp.mutable(this.entity)
        //}else{
            //return comp.getFrom(this.entity)
        //}
    }
    getComponentR<T extends EcsType = EcsType<any>>(comp:ComponentDefinition<T>):DeepReadonly<ComponentType<T>>{
        //if(mutable===undefined || mutable){
            //return comp.mutable(this.entity)
        //}else{
            return comp.getFrom(this.entity)
        //}
    }
    addComponent<T extends EcsType = EcsType<any>>(comp:ComponentDefinition<T>,val?: ComponentType<T>){
        return comp.create(this.entity,val)
    }
    
}