import { Result } from "antd";
import React from "react";
import StyledCenterContainer from "./styled/CenterContainer";

// TODO: Redesign the error icon
const GeneralError: React.SFC<{}> = props => {
  const { children } = props;

  return (
    <StyledCenterContainer>
      <Result status="error" title="Error">
        {children || "An error occurred"}
      </Result>
    </StyledCenterContainer>
  );
};

export default GeneralError;
