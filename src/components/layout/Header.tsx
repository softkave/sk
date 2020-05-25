import {
  AppstoreFilled,
  BorderOutlined,
  CaretDownFilled,
  HomeFilled,
  HomeOutlined,
  LogoutOutlined,
  MailFilled,
  MailOutlined,
} from "@ant-design/icons";
import styled from "@emotion/styled";
import { Button, Dropdown, Menu, Tooltip } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import logoutUserOperationFunc from "../../redux/operations/session/logoutUser";
import { getSignedInUserRequired } from "../../redux/session/selectors";
import ItemAvatar from "../ItemAvatar";
import RenderForDevice from "../RenderForDevice";
import StyledContainer from "../styled/Container";
import StyledFlatButton from "../styled/FlatButton";
import theme from "../theme";

export interface IHeaderProps {
  onNavigateBack?: () => void;
}

const Header: React.FC<IHeaderProps> = (props) => {
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
    // TODO: disabledback button for now
    return (
      <StyledHeaderContainer>
        <StyledContainer s={{ alignItems: "center" }}>
          {/* <Tooltip title="Home">
            <StyledFlatButton style={{ marginRight: "16px" }}>
              <Link to="/app">
                {window.location.pathname === "/app" ? (
                  <HomeFilled />
                ) : (
                  <HomeOutlined />
                )}
                {!isMobile && <span style={{ paddingLeft: "12px" }}>Home</span>}
              </Link>
            </StyledFlatButton>
          </Tooltip> */}
          <Tooltip title="Messages">
            <StyledFlatButton style={{ marginRight: "16px" }}>
              <Link to="/app/notifications">
                {window.location.pathname.includes("notification") ? (
                  <MailFilled />
                ) : (
                  <MailOutlined />
                )}
                {!isMobile && (
                  <span style={{ paddingLeft: "12px" }}>Messages</span>
                )}
              </Link>
            </StyledFlatButton>
          </Tooltip>
          <Tooltip title="Organizations">
            <StyledFlatButton>
              <Link to="/app/organizations">
                {window.location.pathname.includes("organizations") ? (
                  <AppstoreFilled />
                ) : (
                  <BorderOutlined />
                )}
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
  // borderBottom: "1px solid #b0b0b0"
});

const StyledAvatarButton = styled(Button)({
  border: "none",
  backgroundColor: "inherit",
  boxShadow: "none",
  padding: 0,
});

const StyledMenuItem = styled(Menu.Item)({});
