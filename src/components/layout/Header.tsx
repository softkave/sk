import {
  ArrowLeftOutlined,
  CaretDownFilled,
  LogoutOutlined
} from "@ant-design/icons";
import styled from "@emotion/styled";
import { Button, Dropdown, Menu } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import logoutUserOperationFunc from "../../redux/operations/session/logoutUser";
import { getSignedInUserRequired } from "../../redux/session/selectors";
import ItemAvatar from "../ItemAvatar";
import StyledContainer from "../styled/Container";
import StyledFlatButton from "../styled/FlatButton";
import theme from "../theme";

export interface IHeaderProps {
  content?: React.ReactNode;
  onNavigateBack?: () => void;
}

const Header: React.FC<IHeaderProps> = props => {
  const user = useSelector(getSignedInUserRequired);
  const history = useHistory();

  const onLogout = () => {
    logoutUserOperationFunc();
  };

  const onSelectAvatarMenu = event => {
    if (event.key === "logout") {
      onLogout();
    }
  };

  // const navigateToPath = (key: string) => {
  //   const path = `/app/${key}`;
  //   history.push(path);
  // };

  const isInBasePath = () => {
    return window.location.pathname.split("/").pop() === "app";
  };

  const defaultOnNavigateBack = () => {
    const pathArr = window.location.pathname.split("/");
    pathArr.pop();
    const destPath = pathArr.join("/");

    // TODO: Prefferably, first check if the destPath is contained in the stack,
    // and remove it if it does. Otherwise, go to the destPath
    history.push(destPath);
  };

  const content = props.content || <StyledH1>Softkave</StyledH1>;
  const onNavigateBack =
    props.onNavigateBack || (!isInBasePath() && defaultOnNavigateBack);
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

  // TODO: implement line clamping on the application name
  return (
    <StyledHeaderContainer>
      {onNavigateBack && (
        <StyledFlatButton
          onClick={onNavigateBack}
          style={{ marginRight: "12px", paddingTop: "4px" }}
        >
          <ArrowLeftOutlined />
        </StyledFlatButton>
      )}
      <StyledApplicationNameContainer>{content}</StyledApplicationNameContainer>
      <StyledContainer s={{ marginLeft: "12px" }}>
        <Dropdown overlay={avatarMenuOverlay} trigger={["click"]}>
          <StyledAvatarButton>
            <ItemAvatar
              clickable
              size="small"
              onClick={() => null}
              color={user.color || theme.colors.defaults.avatar}
            />
            <CaretDownFilled style={{ marginLeft: "4px", fontSize: "14px" }} />
          </StyledAvatarButton>
        </Dropdown>
      </StyledContainer>
    </StyledHeaderContainer>
  );
};

export default Header;

const StyledApplicationNameContainer = styled.div({
  display: "flex",
  flex: 1,
  marginBottom: 0,
  alignItems: "start",
  marginRight: "12px",
  textOverflow: "ellipsis"
});

const StyledH1 = styled.h1({
  marginBottom: 0,
  lineHeight: "32px",
  fontSize: "18px"
});

const StyledHeaderContainer = styled.div({
  display: "flex",
  width: "100%",
  padding: "16px 16px"
});

const StyledAvatarButton = styled(Button)({
  border: "none",
  backgroundColor: "inherit",
  boxShadow: "none",
  padding: 0
});

const StyledMenuItem = styled(Menu.Item)({});
