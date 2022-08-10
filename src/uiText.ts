import { CubeIdentifierComponent } from './components/cube'

const { UiTransform, UiText } = engine.baseComponents

export function createUIText(text:string, width: float = 100, height: float = 100, parentEntity: number = 7): Entity {
    const entity = engine.addEntity()
    
    UiTransform.create(entity, {
        parentEntity: parentEntity,
        alignContent: YGAlign.YGAlignCenter,
        alignItems: YGAlign.YGAlignCenter,
        alignSelf: YGAlign.YGAlignCenter,
        borderBottom: 0,
        borderLeft: 0,
        borderRight: 0,
        borderTop: 0,
        direction: YGDirection.YGDirectionInherit,
        display: YGDisplay.YGDisplayFlex,
        flex: 1,
        flexBasis: 1,
        flexBasisUnit: 1,
        flexDirection: YGFlexDirection.YGFlexDirectionColumn,
        flexGrow: 0,
        flexShrink: 0,
        height: height,
        width: width,
        flexWrap: YGWrap.YGWrapWrap,
        heightUnit: YGUnit.YGUnitAuto,
        justifyContent: YGJustify.YGJustifyCenter,
        marginBottom: 0,
        marginBottomUnit: YGUnit.YGUnitAuto,
        marginLeft: 0,
        marginLeftUnit: YGUnit.YGUnitAuto,
        marginRight: 0,
        marginRightUnit: YGUnit.YGUnitAuto,
        marginTop: 0,
        marginTopUnit: YGUnit.YGUnitAuto,
        maxHeight: 500,
        maxHeightUnit: YGUnit.YGUnitAuto,
        maxWidth: 500,
        maxWidthUnit: YGUnit.YGUnitAuto,
        minHeight: 100,
        minHeightUnit: YGUnit.YGUnitAuto,
        minWidth: 100,
        minWidthUnit: YGUnit.YGUnitAuto,
        overflow: YGOverflow.YGOverflowScroll,
        paddingBottom: 0,
        paddingBottomUnit: YGUnit.YGUnitAuto,
        paddingLeft: 0,
        paddingLeftUnit: YGUnit.YGUnitAuto,
        paddingRight: 0,
        paddingRightUnit: YGUnit.YGUnitAuto,
        paddingTop: 0,
        paddingTopUnit: YGUnit.YGUnitAuto,
        positionBottom: 0,
        positionBottomUnit: YGUnit.YGUnitAuto,
        positionLeft: 0,
        positionLeftUnit: YGUnit.YGUnitAuto,
        positionRight: 0,
        positionRightUnit: YGUnit.YGUnitAuto,
        positionTop: 0,
        positionTopUnit: YGUnit.YGUnitAuto,
        positionType: YGPositionType.YGPositionTypeAbsolute,
        widthUnit:YGUnit.YGUnitAuto
    })
    
    UiText.create(entity, {
        text: text,
        textColor: { r: 1, g: 1, b: 1}
    })

    return entity
}
