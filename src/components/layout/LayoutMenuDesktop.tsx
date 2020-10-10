import { Typography } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { logoutUserOperationAction } from "../../redux/operations/session/logoutUser";
import OrgsListContainer from "../org/OrgsListContainer";
import StyledContainer from "../styled/Container";

const LayoutMenuDesktop: React.FC<{}> = () => {
    const dispatch = useDispatch();

    const onLogout = () => {
        dispatch(logoutUserOperationAction());
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
                    }}
                >
                    softkave
                </Typography.Title>
            </StyledContainer>
            <StyledContainer
                s={{
                    padding: "8px 0",
                    flex: 1,
                }}
            >
                <OrgsListContainer />
            </StyledContainer>
            <StyledContainer
                s={{
                    padding: "16px",
                    cursor: "pointer",

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

export default LayoutMenuDesktop;
