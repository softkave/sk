import styled from "@emotion/styled";
import React from "react";

const WebFooter: React.SFC<{}> = () => {
  return (
    <StyledWebFooter>
      &copy;&nbsp;&nbsp;-&nbsp;&nbsp;Softkave&nbsp;&nbsp;- &nbsp;&nbsp;
      {new Date().getFullYear()}
    </StyledWebFooter>
  );
};

export default WebFooter;

const StyledWebFooter = styled.div`
  padding: 16px;
  text-align: center;
`;
