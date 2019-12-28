import styled from "@emotion/styled";
import { Button, Dropdown, Menu } from "antd";
import React from "react";
import { Link } from "react-router-dom";

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
              <Menu.Item key="signup">
                <Link to="/signup">Signup</Link>
              </Menu.Item>
              <Menu.Item key="login">
                <Link to="login">Login</Link>
              </Menu.Item>
              <Menu.Item key="forgot-password">
                <Link to="/forgot-password">Forgot Password</Link>
              </Menu.Item>
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
  padding: 16px 24px;
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
