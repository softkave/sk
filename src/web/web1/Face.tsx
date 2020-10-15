/*eslint no-useless-computed-key: "off"*/

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
                    <StyledTagLikeButton
                        to="#pricing"
                        style={{ backgroundColor: "#FF5630" }}
                    >
                        Pricing
                    </StyledTagLikeButton>
                    <StyledTagLikeButton
                        to={webConstants.demoURL}
                        style={{ backgroundColor: "#FFAB00" }}
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
    alignItems: "center",
    display: "flex",
});
