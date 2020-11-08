import styled from "@emotion/styled";
import { Typography } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { logoutUserOpAction } from "../../redux/operations/session/logoutUser";
import OrgsListContainer from "../org/OrgsListContainer";
import StyledContainer from "../styled/Container";

const AppHomeDesktop: React.FC<{}> = () => {
    const dispatch = useDispatch();

    const onLogout = () => {
        dispatch(logoutUserOpAction());
    };

    return (
        <StyledContainer
            s={{
                height: "100%",
                minWidth: "320px",
                borderRight: "1px solid #d9d9d9",
                flexDirection: "column",
                overflowY: "auto",
            }}
        >
            <StyledContainer
                s={{
                    height: "56px",
                    alignItems: "center",
                    padding: "0 16px",
                    marginBottom: "4px",
                    borderBottom: "1px solid #d9d9d9",
                }}
            >
                <Typography.Title
                    level={4}
                    style={{
                        margin: 0,
                        fontSize: "16px",
                        lineHeight: "16px",
                        alignItems: "center",
                        display: "flex",
                        // fontWeight: "normal",
                    }}
                >
                    <StyledLink to="/app">Softkave</StyledLink>
                </Typography.Title>
            </StyledContainer>
            <StyledContainer
                s={{
                    flex: 1,
                }}
            >
                <OrgsListContainer />
            </StyledContainer>
            <StyledContainer
                s={{
                    padding: "16px",
                    cursor: "pointer",
                    borderTop: "1px solid #d9d9d9",

                    "&:hover": {
                        backgroundColor: "#eee",
                    },
                }}
                onClick={onLogout}
            >
                Logout
            </StyledContainer>
        </StyledContainer>
    );
};

export default AppHomeDesktop;

const StyledLink = styled(Link)({ color: "inherit !important" });
