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
            <Typography.Title
                level={4}
                style={{
                    padding: "0 16px",
                    paddingTop: "16px",
                    paddingBottom: "8px",
                }}
            >
                softkave
            </Typography.Title>
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
