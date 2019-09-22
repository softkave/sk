import styled from "@emotion/styled";
import React from "react";
import ScrollList from "../ScrollList";

const GroupBody = React.memo(props => {
  const { children } = props;

  return (
    <StyledGroupBody>
      <ScrollList>{children}</ScrollList>
    </StyledGroupBody>
  );
});

const StyledGroupBody = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
`;

export default GroupBody;
