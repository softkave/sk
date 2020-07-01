import { Space, Typography } from "antd";
import React from "react";
import StyledContainer from "../styled/Container";
import LayoutMenuOrgsSectionContainer from "./LayoutMenuOrgsSectionContainer";

export interface ILayoutMenuDesktopProps {
  onSelectNotifications: () => void;
}

const LayoutMenuDesktop: React.FC<ILayoutMenuDesktopProps> = (props) => {
  const { onSelectNotifications } = props;

  const notificationsSelected = window.location.pathname.includes(
    "notification"
  );

  return (
    <StyledContainer
      s={{
        height: "100%",
        width: "320px",
        borderRight: "1px solid #d9d9d9",
        backgroundColor: "#fafafa",
        flexDirection: "column",
        overflowY: "auto",
      }}
    >
      <Typography.Title
        level={4}
        style={{ padding: "0 16px", paddingTop: "16px", paddingBottom: "8px" }}
      >
        softkave
      </Typography.Title>
      <StyledContainer
        onClick={onSelectNotifications}
        s={{
          padding: "8px 16px",
          borderTop: "1px solid #d9d9d9",
          borderBottom: "1px solid #d9d9d9",
          cursor: "pointer",
          backgroundColor: notificationsSelected ? "#eee" : undefined,

          "&:hover": {
            backgroundColor: "#eee",
          },
        }}
      >
        <Typography.Text strong>Notifications</Typography.Text>
      </StyledContainer>
      <StyledContainer
        s={{
          padding: "8px 0",
        }}
      >
        <LayoutMenuOrgsSectionContainer />
      </StyledContainer>
    </StyledContainer>
  );
};

export default LayoutMenuDesktop;
