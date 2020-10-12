import styled from "@emotion/styled";
import { Space, Typography } from "antd";
import React from "react";
import { ArrowRightCircle } from "react-feather";
import { Link } from "react-router-dom";
import webConstants from "./constants";
import LogoBorders from "./LogoBorders";

const Face: React.FC<{}> = () => {
    return (
        <StyledFace>
            <Space direction="vertical">
                <LogoBorders />
                <Typography.Paragraph type="secondary" style={{ margin: 0 }}>
                    Chat and task management application
                </Typography.Paragraph>
                <StyledButtonsContainer>
                    <StyledTagLikeButton
                        to="/signup"
                        style={{ backgroundColor: "" }}
                    >
                        Signup
                    </StyledTagLikeButton>
                    <StyledTagLikeButton
                        to="/login"
                        style={{ backgroundColor: "" }}
                    >
                        Login
                    </StyledTagLikeButton>
                    <StyledTagLikeButton
                        to="/forgot-password"
                        style={{ backgroundColor: "" }}
                    >
                        Forgot Password
                    </StyledTagLikeButton>
                    <StyledTagLikeButton
                        to="#pricing"
                        style={{ backgroundColor: "" }}
                    >
                        Pricing
                    </StyledTagLikeButton>
                    <StyledTagLikeButton
                        to={webConstants.demoURL}
                        style={{ backgroundColor: "" }}
                    >
                        <Space>
                            Try Demo
                            <ArrowRightCircle
                                style={{ width: "14px", height: "14px" }}
                            />
                        </Space>
                    </StyledTagLikeButton>
                </StyledButtonsContainer>
            </Space>
        </StyledFace>
    );
};

export default Face;

const StyledButtonsContainer = styled.div({
    display: "flex",
    flexWrap: "wrap",
});

const StyledTagLikeButton = styled(Link)({
    marginRight: "4px",
    color: "white",
    borderRadius: "4px",

    ["&:last-of-type"]: {
        marginRight: 0,
    },
});

const StyledFace = styled.div({
    height: "100%",
    padding: "16px",
    alignItems: "center",
});
