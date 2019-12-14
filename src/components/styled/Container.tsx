import styled from "@emotion/styled";

export interface IStyledContainerProps {
  s?: React.CSSProperties;
}

const StyledContainer = styled("div")<IStyledContainerProps>(props => ({
  ...(props.s || {})
}));

export default StyledContainer;
