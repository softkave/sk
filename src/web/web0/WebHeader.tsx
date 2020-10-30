import { MenuOutlined } from "@ant-design/icons";
import styled from "@emotion/styled";
import { Button } from "antd";
import React from "react";
import { X } from "react-feather";
import { Link } from "react-router-dom";
import RenderForDevice from "../../components/RenderForDevice";
import StyledContainer from "../../components/styled/Container";

const StyledContainerAsH1 = StyledContainer.withComponent("h1");

const WebHeader: React.FC<{}> = () => {
    const [showMenu, setShowMenu] = React.useState(false);

    const renderMenuItemContent = (content: React.ReactNode) => (
        <StyledContainer
            s={{
                justifyContent: "flex-end",
                lineHeight: "40px",
            }}
        >
            <span onClick={() => setShowMenu(false)}>{content}</span>
        </StyledContainer>
    );

    const renderMenu = () => {
        return (
            <StyledContainer
                s={{
                    flexDirection: "column",
                    width: "100%",
                    padding: "16px 0",
                    paddingTop: "8px",
                }}
            >
                <Link to="/app?demo=true">
                    {renderMenuItemContent("Try Demo")}
                </Link>
                <Link to="/signup">{renderMenuItemContent("Signup")}</Link>
                <Link to="/login">{renderMenuItemContent("Login")}</Link>
                <Link to="/forgot-password">
                    {renderMenuItemContent("Forgot Password")}
                </Link>
            </StyledContainer>
        );
    };

    const renderOne = (isMobile: boolean) => {
        return (
            <StyledContainer s={{ flex: 1 }}>
                <StyledContainer
                    s={{
                        flex: 1,
                        marginRight: "16px",
                        flexDirection: "column",
                    }}
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
                </StyledContainer>
                <StyledContainer s={{ alignItems: "center" }}>
                    {!showMenu && !isMobile && (
                        <StyledLink to="/signup">Signup</StyledLink>
                    )}
                    {!showMenu && !isMobile && (
                        <StyledLink to="/login" style={{ marginRight: "16px" }}>
                            Login
                        </StyledLink>
                    )}
                    <Button
                        type="link"
                        style={{
                            padding: 0,
                            color: "rgba(0,0,0,0.65)",
                            display: "inline-flex",
                            alignItems: "center",
                        }}
                        onClick={() => setShowMenu(!showMenu)}
                    >
                        {showMenu ? (
                            <X style={{ width: "20px" }} />
                        ) : (
                            <MenuOutlined />
                        )}
                    </Button>
                </StyledContainer>
            </StyledContainer>
        );
    };

    return (
        <StyledWebHeader>
            <StyledContainer
                s={{
                    width: "100%",
                    margin: "auto",
                    flexDirection: "column",
                }}
            >
                <RenderForDevice
                    renderForDesktop={() => renderOne(false)}
                    renderForMobile={() => renderOne(true)}
                />
                {showMenu && renderMenu()}
            </StyledContainer>
        </StyledWebHeader>
    );
};

export default WebHeader;

const StyledWebHeader = styled.div`
    padding: 16px 16px;
`;

const StyledLink = styled(Link)({
    padding: "0 16px",
});
