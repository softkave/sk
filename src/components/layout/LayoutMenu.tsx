import MenuFoldOutlined from "@ant-design/icons/MenuFoldOutlined";
import { Space } from "antd";
import React from "react";
import StyledContainer from "../styled/Container";
import LayoutMenuOrgsSectionContainer from "./LayoutMenuOrgsSectionContainer";

export interface ILayoutMenuProps {
  onToggleMenu: () => void;
}

const LayoutMenu: React.FC<ILayoutMenuProps> = (props) => {
  const { onToggleMenu } = props;

  return (
    <StyledContainer
      s={{
        height: "100%",
        width: "360px",
        maxWidth: "100%",
        borderRight: "1px solid #d9d9d9",
        backgroundColor: "#fafafa",
      }}
    >
      <Space direction="vertical" style={{ width: "100%" }}>
        <StyledContainer s={{ padding: "16px" }}>
          <MenuFoldOutlined onClick={onToggleMenu} />
        </StyledContainer>
        <StyledContainer>
          <LayoutMenuOrgsSectionContainer />
        </StyledContainer>
      </Space>
    </StyledContainer>
  );
};

export default LayoutMenu;
