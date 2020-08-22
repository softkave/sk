import { CaretDownFilled, LogoutOutlined } from "@ant-design/icons";
import styled from "@emotion/styled";
import { Button, Dropdown, Menu, Tooltip, Typography } from "antd";
import React from "react";
import { Bell, Grid } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logoutUserOperationAction } from "../../redux/operations/session/logoutUser";
import SessionSelectors from "../../redux/session/selectors";
import { AppDispatch } from "../../redux/types";
import ItemAvatar from "../ItemAvatar";
import RenderForDevice from "../RenderForDevice";
import StyledContainer from "../styled/Container";
import StyledFlatButton from "../styled/FlatButton";
import theme from "../theme";

export interface IHeaderOldProps {
  onNavigateBack?: () => void;
}

const HeaderMobile: React.FC<IHeaderOldProps> = (props) => {
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

  const notificationsSelected = window.location.pathname.includes(
    "notification"
  );
  const orgsSelected = window.location.pathname.includes("organizations");

  const render = (isMobile: boolean) => {
    // TODO: disabledback button for now
    return (
      <StyledHeaderContainer>
        <StyledContainer s={{ flex: 1 }}>
          <Typography.Title level={4} style={{ marginBottom: 0 }}>
            softkave
          </Typography.Title>
        </StyledContainer>
        <StyledContainer s={{ alignItems: "center" }}>
          <Tooltip title="Organizations">
            <StyledFlatButton style={{ marginRight: "16px" }}>
              <Link to="/app/organizations">
                <Grid
                  style={{
                    width: "16px",
                    verticalAlign: "middle",
                    color: orgsSelected ? "rgb(66,133,244)" : undefined,
                  }}
                />
              </Link>
            </StyledFlatButton>
          </Tooltip>
          <Tooltip title="Messages">
            <StyledFlatButton>
              <Link to="/app/notifications">
                <Bell
                  style={{
                    width: "16px",
                    verticalAlign: "middle",
                    color: notificationsSelected
                      ? "rgb(66,133,244)"
                      : undefined,
                  }}
                />
              </Link>
            </StyledFlatButton>
          </Tooltip>
        </StyledContainer>
        <StyledContainer s={{ marginLeft: "16px" }}>
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

export default HeaderMobile;

const StyledHeaderContainer = styled.div({
  display: "flex",
  width: "100%",
  padding: "16px 16px",
});

const StyledAvatarButton = styled(Button)({
  border: "none",
  backgroundColor: "inherit",
  boxShadow: "none",
  padding: 0,
});

const StyledMenuItem = styled(Menu.Item)({});
