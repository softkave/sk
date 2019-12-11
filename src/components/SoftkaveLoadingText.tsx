import styled from "@emotion/styled";
import React from "react";

import LoadingText, { ILoadingTextProps } from "./LoadingText";

const SoftkaveLoadingText: React.FC<ILoadingTextProps> = props => {
  return (
    <LoadingText {...props}>
      <StyledText>Softkave</StyledText>
    </LoadingText>
  );
};

export default SoftkaveLoadingText;

const StyledText = styled.div({
  fontSize: "24px"
});
