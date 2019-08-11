import styled from "@emotion/styled";
import React from "react";
import SimpleBar from "simplebar-react";

import "simplebar/dist/simplebar.css";

const ScrollList = React.memo(props => {
  const { children } = props;

  return (
    <BodyContainer>
      <ScrollContainer>
        <ScrollContainerInner>{children}</ScrollContainerInner>
      </ScrollContainer>
    </BodyContainer>
  );
});

export default ScrollList;

const ScrollContainer = styled(SimpleBar)`
  overflow-x: hidden;
  height: 100%;
`;

const ScrollContainerInner = styled.div`
  margin: 12px;
`;

const BodyContainer = styled.div`
  flex: 1;
`;
