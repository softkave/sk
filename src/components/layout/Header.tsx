import {
  AppstoreFilled,
  BorderOutlined,
  CaretDownFilled,
  LogoutOutlined,
  MailFilled,
  MailOutlined,
} from "@ant-design/icons";
import styled from "@emotion/styled";
import { Button, Dropdown, Menu, Tooltip } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import logoutUserOperationFunc from "../../redux/operations/session/logoutUser";
import { getSignedInUserRequired } from "../../redux/session/selectors";
import ItemAvatar from "../ItemAvatar";
import RenderForDevice from "../RenderForDevice";
import StyledContainer from "../styled/Container";
import StyledFlatButton from "../styled/FlatButton";
import theme from "../theme";

// TODO: there is a lag is style responsiveness when 'notifications' or 'organizations' is selected

export interface IHeaderProps {}

const Header: React.FC<IHeaderProps> = () => {
  const user = useSelector(getSignedInUserRequired);

  const onLogout = () => {
    logoutUserOperationFunc();
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

  const render = (isMobile: boolean) => {
    const isNotificationSelected = window.location.pathname.includes(
      "notification"
    );
    const isOrgsSelected = window.location.pathname.includes("organizations");

    return (
      <StyledHeaderContainer>
        <StyledContainer s={{ alignItems: "center" }}>
          <Tooltip title="Messages">
            <StyledFlatButton
              style={{
                borderRadius: 0,
                marginRight: "16px",
                color: isNotificationSelected ? "rgb(66,133,244)" : "inherit",
                borderBottom: isNotificationSelected
                  ? "2px solid rgb(66,133,244)"
                  : undefined,
              }}
            >
              <Link to="/app/notifications">
                {isNotificationSelected ? <MailFilled /> : <MailOutlined />}
                {!isMobile && (
                  <span style={{ paddingLeft: "12px" }}>Notifications</span>
                )}
              </Link>
            </StyledFlatButton>
          </Tooltip>
          <Tooltip title="Organizations">
            <StyledFlatButton
              style={{
                borderRadius: 0,
                color: isOrgsSelected ? "rgb(66,133,244)" : "inherit",
                borderBottom: isOrgsSelected
                  ? "2px solid rgb(66,133,244)"
                  : undefined,
              }}
            >
              <Link to="/app/organizations">
                {isOrgsSelected ? <AppstoreFilled /> : <BorderOutlined />}
                {!isMobile && (
                  <span style={{ paddingLeft: "12px" }}>Organizations</span>
                )}
              </Link>
            </StyledFlatButton>
          </Tooltip>
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

  return (
    <RenderForDevice
      renderForDesktop={() => render(false)}
      renderForMobile={() => render(true)}
    />
  );
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
