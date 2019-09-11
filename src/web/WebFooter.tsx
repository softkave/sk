import styled from "@emotion/styled";
import React from "react";

const WebFooter: React.SFC<{}> = () => {
  return (
    <StyledWebFooter>
      &copy;&nbsp;&nbsp;-&nbsp;&nbsp;Abayomi Akintomide & Ajayi
      Solomon&nbsp;&nbsp;- &nbsp;&nbsp;2019
    </StyledWebFooter>
  );
};

export default WebFooter;

const StyledWebFooter = styled.div`
  padding: 16px;
  text-align: center;
`;
