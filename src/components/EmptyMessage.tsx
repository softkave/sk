import { Empty } from "antd";
import React from "react";
import StyledContainer from "./styled/Container";

const EmptyMessage: React.FC<{}> = props => {
  const { children } = props;

  return (
    <StyledContainer
      s={{
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      <Empty description={children} />
    </StyledContainer>
  );
};

export default EmptyMessage;
