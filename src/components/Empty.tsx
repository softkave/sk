import { Empty } from "antd";
import React from "react";
import StyledCenterContainer from "./styled/CenterContainer";

const EmptyContainer: React.FC<{}> = props => {
  const { children } = props;

  return (
    <StyledCenterContainer>
      <Empty description={children} />
    </StyledCenterContainer>
  );
};

export default EmptyContainer;
