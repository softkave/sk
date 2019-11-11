import styled from "@emotion/styled";
import React from "react";
import ScrollList from "../ScrollList";
import { isOSWindows } from "../userAgent";

// TODO: should we show custom scroll on only Windows, or which other OS should we support
const ColumnBody = React.memo(props => {
  const { children } = props;

  return (
    <StyledColumnBody>
      {isOSWindows() ? <ScrollList>{children}</ScrollList> : children}
    </StyledColumnBody>
  );
});

const StyledColumnBody = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
`;

export default ColumnBody;
