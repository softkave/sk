import styled from "@emotion/styled";
import { Button, Dropdown, Icon, Menu } from "antd";
import React from "react";
import { IUser } from "../../models/user/user";
import ItemAvatar from "../ItemAvatar";
import StyledContainer from "../styled/Container";
import theme from "../theme";

export interface IHeaderProps {
  user: IUser;
  onLogout: () => void;
  onToggleMenu?: () => void;
}

const Header: React.FC<IHeaderProps> = props => {
  const { user, onToggleMenu, onLogout } = props;

  const onSelectAvatarMenu = event => {
    if (event.key === "logout") {
      onLogout();
    }
  };

  return (
    <StyledHeaderContainer>
      {onToggleMenu && (
        <StyledContainer>
          <StyledMenuButton icon="menu" onClick={onToggleMenu} />
        </StyledContainer>
      )}
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
            {/* <Icon type="caret-down" theme="filled" /> */}
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
