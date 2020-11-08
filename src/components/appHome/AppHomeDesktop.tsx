import styled from "@emotion/styled";
import { Typography } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import { IUser } from "../../models/user/user";
import OrgsListContainer from "../org/OrgsListContainer";
import StyledContainer from "../styled/Container";
import AppHomeDesktopMenu from "./AppHomeDesktopMenu";
import { UserOptionsMenuKeys } from "./UserOptionsMenu";

export interface IAppHomeDesktopProps {
    user: IUser;
    onSelect: (key: UserOptionsMenuKeys) => void;
}

const AppHomeDesktop: React.FC<IAppHomeDesktopProps> = (props) => {
    const { user, onSelect } = props;

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
            <AppHomeDesktopMenu user={user} onSelect={onSelect} />
        </StyledContainer>
    );
};

export default AppHomeDesktop;

const StyledLink = styled(Link)({ color: "inherit !important" });
