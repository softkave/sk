import styled from "@emotion/styled";
import { Space, Typography } from "antd";
import React from "react";
import { ArrowRightCircle } from "react-feather";
import { Link } from "react-router-dom";
import RenderForDevice from "../../components/RenderForDevice";
import webConstants from "./constants";

const desktopStyles: Record<string, React.CSSProperties> = {
    p1: { textAlign: "center", fontSize: "32px", margin: "32px 0" },
    p2: { textAlign: "center", marginBottom: "24px", fontSize: "16px" },
    face: {
        justifyContent: "center",
        maxWidth: "520px",
        margin: "auto",
        alignItems: "center",
    },
};

const mobileStyles: Record<string, React.CSSProperties> = {
    p1: { fontSize: "24px", margin: "24px 0" },
    p2: { marginBottom: "24px", fontSize: "16px" },
    face: {},
};

const Face: React.FC<{}> = () => {
    const render = (mobile = false) => {
        const styles = mobile ? mobileStyles : desktopStyles;

        return (
            <StyledFace style={styles.face}>
                <h1
                    style={{
                        fontSize: "16px",
                        textTransform: "uppercase",
                        margin: 0,
                        letterSpacing: "1px",
                        fontWeight: "bold",
                    }}
                >
                    Softkave
                </h1>
                <Typography.Paragraph
                    style={{
                        letterSpacing: "0.5px",
                        ...styles.p1,
                    }}
                >
                    Chat and tasks platform built for startups
                </Typography.Paragraph>
                <Typography.Text style={styles.p2}>
                    The best part is, Softkave is free for your first year!
                    Then, it's a $2 per user per month.
                </Typography.Text>
                <StyledButtonsContainer>
                    <StyledTagLikeButton
                        to="/signup"
                        style={{ backgroundColor: "#36B37E" }}
                    >
                        Signup
                    </StyledTagLikeButton>
                    <StyledTagLikeButton
                        to="/login"
                        style={{ backgroundColor: "#6554C0" }}
                    >
                        Login
                    </StyledTagLikeButton>
                    <StyledTagLikeButton
                        to="/forgot-password"
                        style={{ backgroundColor: "#00B8D9" }}
                    >
                        Forgot Password
                    </StyledTagLikeButton>
                    {/* <StyledTagLikeButtonWithNativeLink
                        href="#pricing"
                        style={{ backgroundColor: "#36B37E" }}
                    >
                        Pricing
                    </StyledTagLikeButtonWithNativeLink> */}
                    <StyledTagLikeButton
                        to={webConstants.demoURL}
                        style={{ backgroundColor: "#FF5630" }}
                    >
                        <Space>
                            Try Demo
                            <ArrowRightCircle
                                style={{
                                    width: "14px",
                                    height: "14px",
                                    verticalAlign: "middle",
                                }}
                            />
                        </Space>
                    </StyledTagLikeButton>
                </StyledButtonsContainer>
            </StyledFace>
        );
    };

    return (
        <RenderForDevice
            renderForDesktop={() => render(false)}
            renderForMobile={() => render(true)}
        />
    );
};

export default Face;

const StyledButtonsContainer = styled.div({
    display: "flex",
    flexWrap: "wrap",
});

const StyledTagLikeButton = styled(Link)({
    marginRight: "6px",
    color: "white",
    borderRadius: "4px",
    padding: "2px 8px",
    marginBottom: "4px",

    ["&:last-of-type"]: {
        marginRight: 0,
    },

    ["&:hover"]: {
        color: "white",
    },
});

const StyledFace = styled.div({
    height: "100%",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
});
