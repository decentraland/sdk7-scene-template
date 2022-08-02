export const ui = () => (
  <DivUi width={300} height={300} flexDirection={YGFlexDirection.YGFlexDirectionRow}>
    <DivUi width={100} height={100}>
      <DivUi width={100} height={100} />
      <DivUi width={100} height={100} />
    </DivUi>
    <DivUi width={100} height={100} positionType={YGPositionType.YGPositionTypeAbsolute} />
    <DivUi width={100} height={100} />
    <DivUi width={100} height={100}>
      <DivUi width={100} height={100} />
      <DivUi width={100} height={100} />
    </DivUi>
  </DivUi>
)
