import styled from "@emotion/styled";
import { Button, Dropdown, Icon, Menu } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import logoutUserOperationFunc from "../../redux/operations/session/logoutUser";
import { getSignedInUserRequired } from "../../redux/session/selectors";
import ItemAvatar from "../ItemAvatar";
import StyledContainer from "../styled/Container";
import theme from "../theme";

const StyledContainerAsLink = StyledContainer.withComponent(Link);

const Header: React.FC<{}> = () => {
  const user = useSelector(getSignedInUserRequired);
  const onLogout = () => {
    logoutUserOperationFunc();
  };

  const onSelectAvatarMenu = event => {
    if (event.key === "logout") {
      onLogout();
    }
  };

  return (
    <StyledHeaderContainer>
      <StyledContainerAsLink to="/app">
        <StyledMenuButton icon="home" />
      </StyledContainerAsLink>
      <StyledApplicationNameContainer>
        <StyledH1>Softkave</StyledH1>
      </StyledApplicationNameContainer>
      <StyledContainer>
        <Dropdown
          overlay={
            <Menu onClick={onSelectAvatarMenu} style={{ minWidth: "120px" }}>
              <StyledMenuItem key="logout">
                <StyledContainer
                  s={{ color: "rgb(255, 77, 79)", alignItems: "center" }}
                >
                  <Icon type="logout" />
                  <StyledContainer s={{ flex: 1, marginLeft: "10px" }}>
                    Logout
                  </StyledContainer>
                </StyledContainer>
              </StyledMenuItem>
            </Menu>
          }
          trigger={["click"]}
        >
          <StyledAvatarButton>
            <ItemAvatar
              clickable
              size="small"
              onClick={() => null}
              color={user.color || theme.colors.defaults.avatar}
            />
            <Icon
              type="caret-down"
              theme="filled"
              style={{ marginLeft: "4px", fontSize: "14px" }}
            />
          </StyledAvatarButton>
        </Dropdown>
      </StyledContainer>
    </StyledHeaderContainer>
  );
};

export default Header;

const StyledApplicationNameContainer = styled.div({
  justifyContent: "center",
  display: "flex",
  flex: 1,
  marginBottom: 0,
  alignItems: "start"
});

const StyledH1 = styled.h1({
  marginBottom: 0,
  lineHeight: "32px",
  fontSize: "18px"
});

const StyledHeaderContainer = styled.div({
  display: "flex",
  width: "100%",
  padding: "16px 24px"
});

const StyledAvatarButton = styled(Button)({
  border: "none",
  backgroundColor: "inherit",
  boxShadow: "none",
  padding: 0
});

const StyledMenuButton = styled(Button)({
  width: "14px !important",
  border: "none",
  backgroundColor: "inherit",
  boxShadow: "none"
});

const StyledMenuItem = styled(Menu.Item)({});
