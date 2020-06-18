import {
  AppstoreFilled,
  BorderOutlined,
  CaretDownFilled,
  LogoutOutlined,
  MailFilled,
  MailOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import styled from "@emotion/styled";
import { Button, Dropdown, Menu, Tooltip } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { setKeyValue } from "../../redux/key-value/actions";
import { KeyValueProperties } from "../../redux/key-value/reducer";
import { getKeyValue } from "../../redux/key-value/selectors";
import logoutUserOperationFunc from "../../redux/operations/session/logoutUser";
import { getSignedInUserRequired } from "../../redux/session/selectors";
import { IAppState } from "../../redux/store";
import ItemAvatar from "../ItemAvatar";
import RenderForDevice from "../RenderForDevice";
import StyledContainer from "../styled/Container";
import StyledFlatButton from "../styled/FlatButton";
import theme from "../theme";

// TODO: there is a lag is style responsiveness when 'notifications' or 'organizations' is selected

export interface IHeaderProps {
  showMenuIcon: boolean;
  onToggleMenu: () => void;
}

const Header: React.FC<IHeaderProps> = (props) => {
  const { showMenuIcon, onToggleMenu } = props;
  const history = useHistory();
  const dispatch = useDispatch();
  const user = useSelector(getSignedInUserRequired);
  const cachedOrgPath = useSelector((state) =>
    getKeyValue(state as IAppState, KeyValueProperties.CachedOrgPath)
  );

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
          {showMenuIcon && (
            <MenuUnfoldOutlined
              onClick={onToggleMenu}
              style={{ cursor: "pointer" }}
            />
          )}
          {/* <Tooltip title="Notifications">
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
              <StyledContainer
                onClick={() => {
                  dispatch(
                    setKeyValue([
                      KeyValueProperties.CachedOrgPath,
                      window.location.pathname,
                    ])
                  );
                  history.push("/app/notifications");
                }}
              >
                {isNotificationSelected ? <MailFilled /> : <MailOutlined />}
                {!isMobile && (
                  <span style={{ paddingLeft: "12px" }}>Notifications</span>
                )}
              </StyledContainer>
            </StyledFlatButton>
          </Tooltip> */}
          {/* <Tooltip title="Organizations">
            <StyledFlatButton
              style={{
                borderRadius: 0,
                color: isOrgsSelected ? "rgb(66,133,244)" : "inherit",
                borderBottom: isOrgsSelected
                  ? "2px solid rgb(66,133,244)"
                  : undefined,
              }}
            >
              <StyledContainer
                onClick={() => {
                  if (cachedOrgPath) {
                    history.push(cachedOrgPath as string);
                  } else {
                    history.push("/app/organizations");
                  }
                }}
              >
                {isOrgsSelected ? <AppstoreFilled /> : <BorderOutlined />}
                {!isMobile && (
                  <span style={{ paddingLeft: "12px" }}>Organizations</span>
                )}
              </StyledContainer>
            </StyledFlatButton>
          </Tooltip> */}
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
