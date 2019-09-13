import styled from "@emotion/styled";
import React from "react";
import SimpleBar from "simplebar-react";

import "simplebar/dist/simplebar.css";

export interface IScrollListProps {
  className?: string;
  scrollClassName?: string;
}

const ScrollList: React.SFC<IScrollListProps> = React.memo(props => {
  const { children, className } = props;

  return (
    <BodyContainer className={className}>
      <ScrollContainer>
        <ScrollContainerInner>{children}</ScrollContainerInner>
      </ScrollContainer>
    </BodyContainer>
  );
});

export default ScrollList;

const ScrollContainer = styled(SimpleBar)`
  overflow-x: hidden;
  overflow-y: auto;
  height: 100%;
  width: 100%;
`;

const ScrollContainerInner = styled.div`
  // padding: 0 12px;
  overflow-x: hidden;
`;

const BodyContainer = styled.div`
  flex: 1;
  height: 100%;
  overflow: hidden;
`;
