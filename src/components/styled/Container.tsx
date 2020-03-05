import styled, { CSSObject } from "@emotion/styled";

export interface IStyledContainerProps {
  s?: CSSObject | React.CSSProperties;
}

const StyledContainer = styled("div")<IStyledContainerProps>(props => ({
  display: "flex",
  ...(props.s || {})
}));

export default StyledContainer;
