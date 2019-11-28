import styled from "@emotion/styled";
import { Dropdown, Icon, Menu } from "antd";
import React from "react";
import { IUser } from "../../models/user/user";
import ItemAvatar from "../ItemAvatar";
import StyledFlatButton from "../styled/FlatButton";
import StyledFlexContainer from "../styled/FlexContainer";
import theme from "../theme";

export interface IHeaderProps {
  user: IUser;
  onToggleMenu: () => void;
  onLogout: () => void;
}

const Header: React.SFC<IHeaderProps> = props => {
  const { user, onToggleMenu, onLogout } = props;

  const onSelectAvatarMenu = event => {
    if (event.key === "logout") {
      onLogout();
    }
  };

  return (
    <StyledHeaderContainer>
      <div>
        <StyledFlatButton icon="menu" onClick={onToggleMenu} />
      </div>
      <StyledApplicationNameContainer>Softkave</StyledApplicationNameContainer>
      <div>
        <Dropdown
          overlay={
            <Menu onClick={onSelectAvatarMenu} style={{ minWidth: "120px" }}>
              <Menu.Item key="logout">Logout</Menu.Item>
            </Menu>
          }
          trigger={["click"]}
        >
          <StyledFlatButton>
            <ItemAvatar
              clickable
              onClick={() => null}
              color={user.color || theme.colors.defaults.avatar}
            />
            <Icon type="caret-down" />
          </StyledFlatButton>
        </Dropdown>
      </div>
    </StyledHeaderContainer>
  );
};

export default Header;

const StyledApplicationNameContainer = styled.h1({
  justifyContent: "center",
  display: "flex",
  flex: 1
});

const StyledHeaderContainer = styled.div({
  display: "flex",
  width: "100%",
  padding: "16px"
});
