import styled from "@emotion/styled";
import { Button, Dropdown, Icon, Menu } from "antd";
import React from "react";
import { IUser } from "../../models/user/user";
import ItemAvatar from "../ItemAvatar";
import theme from "../theme";

export interface IHeaderProps {
  user: IUser;
  onToggleMenu: () => void;
  onLogout: () => void;
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
      <div>
        <StyledMenuButton icon="menu" onClick={onToggleMenu} />
      </div>
      <StyledApplicationNameContainer>
        <StyledH1>Softkave</StyledH1>
      </StyledApplicationNameContainer>
      <div>
        <Dropdown
          overlay={
            <Menu onClick={onSelectAvatarMenu} style={{ minWidth: "120px" }}>
              <Menu.Item key="logout">Logout</Menu.Item>
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
            <Icon type="caret-down" />
          </StyledAvatarButton>
        </Dropdown>
      </div>
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
  padding: "16px"
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
