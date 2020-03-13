import {
  UserOutlined,
  HomeOutlined,
  MailOutlined,
  BlockOutlined
} from "@ant-design/icons";
import React from "react";
import { useHistory } from "react-router";
import StyledContainer from "../styled/Container";
import { getCurrentBaseNavPath } from "./path";

export type HomeControlBarType = "icon-only" | "icon-with-text";

export interface IHomeControlBarProps {
  type: HomeControlBarType;
}

const iconOnlyCurrentItemStyles: React.CSSProperties = {
  color: "rgb(66,133,244)"
};

const iconWithTextOnlyCurrentItemStyles: React.CSSProperties = {
  borderTop: "2px solid rgb(66,133,244)"
};

const itemStyles: React.CSSProperties = {
  borderTop: "2px solid rgba(0,0,0,0)"
};

const HomeControlBar: React.FC<IHomeControlBarProps> = props => {
  const { type } = props;
  const history = useHistory();
  const showText = type === "icon-with-text";
  const currentItem = getCurrentBaseNavPath();
  const currentItemStyles = showText
    ? iconWithTextOnlyCurrentItemStyles
    : iconOnlyCurrentItemStyles;

  const onClick = (key: string) => {
    history.push(`/app/${key}`);
  };

  return (
    <StyledContainer>
      <StyledContainer
        onClick={() => onClick("home")}
        s={{
          ...itemStyles,
          ...(currentItem === "home" ? currentItemStyles : {})
        }}
      >
        <HomeOutlined />
        {showText && <StyledContainer>Home</StyledContainer>}
      </StyledContainer>
      <StyledContainer
        onClick={() => onClick("notifications")}
        s={{
          ...itemStyles,
          ...(currentItem === "notifications" ? currentItemStyles : {})
        }}
      >
        <MailOutlined />
        {showText && <StyledContainer>Notifications</StyledContainer>}
      </StyledContainer>
      <StyledContainer
        onClick={() => onClick("organizations")}
        s={{
          ...itemStyles,
          ...(currentItem === "organizations" ? currentItemStyles : {})
        }}
      >
        <BlockOutlined />
        {showText && <StyledContainer>Organizations</StyledContainer>}
      </StyledContainer>
      <StyledContainer
        onClick={() => onClick("user")}
        s={{
          ...itemStyles,
          ...(currentItem === "user" ? currentItemStyles : {})
        }}
      >
        <UserOutlined />
        {showText && <StyledContainer>User</StyledContainer>}
      </StyledContainer>
    </StyledContainer>
  );
};

export default HomeControlBar;
