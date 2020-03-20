import { Drawer } from "antd";
import React from "react";
import StyledContainer from "../styled/Container";

const renderOptionsDrawer = (
  title: string,
  onClose: () => void,
  render: () => React.ReactNode
) => {
  return (
    <Drawer
      visible
      closable
      title={title}
      placement="right"
      onClose={onClose}
      width={300}
    >
      <StyledContainer
        s={{
          flexDirection: "column",
          width: "100%",
          flex: 1,
          alignItems: "center"
        }}
      >
        {render()}
      </StyledContainer>
    </Drawer>
  );
};

export default renderOptionsDrawer;
