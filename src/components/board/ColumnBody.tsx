import styled from "@emotion/styled";
import React from "react";

// TODO: should we show custom scroll on only Windows, or which other OS should we support
const ColumnBody = React.memo(props => {
  const { children } = props;

  return <StyledColumnBody>{children}</StyledColumnBody>;
});

const StyledColumnBody = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
`;

export default ColumnBody;
