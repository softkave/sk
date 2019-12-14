import styled from "@emotion/styled";

export interface IStyledContainerProps {
  s?: React.CSSProperties;
}

const StyledContainer = styled("div")<IStyledContainerProps>(props => ({
  display: "flex",
  ...(props.s || {})
}));

export default StyledContainer;
