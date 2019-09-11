import styled from "@emotion/styled";
import { Button, Dropdown, Menu } from "antd";
import React from "react";
import Logo from "../components/Logo";

const WebHeader: React.SFC<{}> = () => {
  return (
    <StyledWebHeader>
      <StyledLeftButtons>
        <Logo />
      </StyledLeftButtons>
      <StyledRightButtons>
        <Dropdown
          trigger={["click"]}
          overlay={
            <Menu style={{ minWidth: "300px" }}>
              <Menu.Item key="signup">Signup</Menu.Item>
              <Menu.Item key="login">Login</Menu.Item>
              <Menu.Item key="forgot-password">ForgotPassword</Menu.Item>
            </Menu>
          }
        >
          <Button icon="menu-fold" />
        </Dropdown>
      </StyledRightButtons>
    </StyledWebHeader>
  );
};

export default WebHeader;

const StyledWebHeader = styled.div`
  padding: 16px;
`;

const StyledRightButtons = styled.div`
  display: inline-block;
  width: 50%;
  text-align: right;
`;

const StyledLeftButtons = styled.div`
  display: inline-block;
  width: 50%;
`;
