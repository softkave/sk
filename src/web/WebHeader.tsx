import { CloseOutlined, MenuOutlined } from "@ant-design/icons";
import styled from "@emotion/styled";
import { Button, Dropdown, Space } from "antd";
import React from "react";
import { Menu, X } from "react-feather";
import { Link } from "react-router-dom";
import StyledContainer from "../components/styled/Container";

const StyledContainerAsH1 = StyledContainer.withComponent("h1");
const hoverSelector = "&:hover";

const WebHeader: React.SFC<{}> = () => {
  const [showMenu, setShowMenu] = React.useState(false);

  const renderMenuItemContent = (content: React.ReactNode) => (
    <StyledContainer
      s={{
        color: "rgba(0,0,0,0.65)",
        justifyContent: "flex-end",
        lineHeight: "40px",
        [hoverSelector]: { color: "rgb(66,133,244)" },
      }}
    >
      {content}
    </StyledContainer>
  );

  const renderMenu = () => {
    return (
      <StyledContainer
        s={{
          flexDirection: "column",
          width: "100%",
          borderBottom: "1px solid #d9d9d9",
          padding: "16px 0",
          paddingTop: "8px",
        }}
      >
        <Link to="/signup">{renderMenuItemContent("Signup")}</Link>
        <Link to="login">{renderMenuItemContent("Login")}</Link>
        <Link to="/forgot-password">
          {renderMenuItemContent("Forgot Password")}
        </Link>
      </StyledContainer>
    );
  };

  const renderOne = () => {
    return (
      <StyledContainer>
        <StyledContainer
          s={{ flex: 1, marginRight: "16px", flexDirection: "column" }}
        >
          <Link to="/">
            <StyledContainerAsH1
              s={{
                fontWeight: "bold",
                fontSize: "16px",
                margin: 0,
              }}
            >
              Softkave
            </StyledContainerAsH1>
          </Link>
          <StyledContainer>Softkave is for task management</StyledContainer>
        </StyledContainer>
        <StyledContainer s={{ alignItems: "center" }}>
          {!showMenu && (
            <Link to="/signup">
              <Button type="link" style={{ padding: 0, marginRight: "24px" }}>
                Signup
              </Button>
            </Link>
          )}
          {!showMenu && (
            <Link to="/login">
              <Button type="link" style={{ padding: 0, marginRight: "24px" }}>
                Login
              </Button>
            </Link>
          )}
          <Button
            type="link"
            style={{
              padding: 0,
              color: "rgba(0,0,0,0.65)",
              display: "inline-flex",
            }}
            onClick={() => setShowMenu(!showMenu)}
          >
            {showMenu ? <X style={{ width: "20px" }} /> : <MenuOutlined />}
          </Button>
        </StyledContainer>
      </StyledContainer>
    );
  };

  return (
    <StyledWebHeader>
      {renderOne()}
      {showMenu && renderMenu()}
    </StyledWebHeader>
  );
};

export default WebHeader;

const StyledWebHeader = styled.div`
  padding: 16px 16px;
`;

const StyledRightButtons = styled.div`
  display: flex;
`;

const StyledLeftButtons = styled.div`
  display: flex;
  flex: 1;
  marginright: 16px;
`;
