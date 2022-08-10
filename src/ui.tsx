export const ui = () => (
    <DivUi width={800} height={800} flexWrap={YGWrap.YGWrapWrap}>
        <DivUi width={400} height={400} >
            <DivUi width={300} height={300} alignSelf={YGAlign.YGAlignCenter} flexDirection={YGFlexDirection.YGFlexDirectionColumn}>
                <DivUi height={20} aspectRatio={1}/>
            </DivUi>
        </DivUi>
    </DivUi>
)
