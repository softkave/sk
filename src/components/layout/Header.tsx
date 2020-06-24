import {
  CaretDownFilled,
  LogoutOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import styled from "@emotion/styled";
import { Button, Dropdown, Menu } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUserOperationAction } from "../../redux/operations/session/logoutUser";
import SessionSelectors from "../../redux/session/selectors";
import { AppDispatch } from "../../redux/types";
import ItemAvatar from "../ItemAvatar";
import StyledContainer from "../styled/Container";
import theme from "../theme";

// TODO: there is a lag is style responsiveness when 'notifications' or 'organizations' is selected

export interface IHeaderProps {
  showMenuIcon: boolean;
  onToggleMenu: () => void;
}

const Header: React.FC<IHeaderProps> = (props) => {
  const { showMenuIcon, onToggleMenu } = props;
  const dispatch: AppDispatch = useDispatch();
  const user = useSelector(SessionSelectors.getSignedInUserRequired);

  const onLogout = () => {
    dispatch(logoutUserOperationAction());
  };

  const onSelectAvatarMenu = (event) => {
    if (event.key === "logout") {
      onLogout();
    }
  };

  const avatarMenuOverlay = (
    <Menu onClick={onSelectAvatarMenu} style={{ minWidth: "120px" }}>
      <StyledMenuItem key="logout">
        <StyledContainer
          s={{ color: "rgb(255, 77, 79)", alignItems: "center" }}
        >
          <LogoutOutlined />
          <StyledContainer s={{ flex: 1, marginLeft: "10px" }}>
            Logout
          </StyledContainer>
        </StyledContainer>
      </StyledMenuItem>
    </Menu>
  );

  const render = () => {
    return (
      <StyledHeaderContainer>
        <StyledContainer s={{ alignItems: "center" }}>
          {showMenuIcon && (
            <MenuUnfoldOutlined
              onClick={onToggleMenu}
              style={{ cursor: "pointer" }}
            />
          )}
        </StyledContainer>
        <StyledContainer s={{ flex: 1 }} />
        <StyledContainer s={{ marginLeft: "12px" }}>
          <Dropdown overlay={avatarMenuOverlay} trigger={["click"]}>
            <StyledAvatarButton>
              <ItemAvatar
                clickable
                size="small"
                onClick={() => null}
                color={user.color || theme.colors.defaults.avatar}
              />
              <CaretDownFilled
                style={{ marginLeft: "4px", fontSize: "14px" }}
              />
            </StyledAvatarButton>
          </Dropdown>
        </StyledContainer>
      </StyledHeaderContainer>
    );
  };

  return render();
};

export default Header;

const StyledHeaderContainer = styled.div({
  display: "flex",
  width: "100%",
  padding: "16px 16px",
  paddingBottom: "24px",
});

const StyledAvatarButton = styled(Button)({
  border: "none",
  backgroundColor: "inherit",
  boxShadow: "none",
  padding: 0,
});

const StyledMenuItem = styled(Menu.Item)({});
