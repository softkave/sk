import styled from "@emotion/styled";
import { Typography } from "antd";
import React from "react";
import { Link } from "react-router-dom";
import { IUser } from "../../models/user/user";
import StyledContainer from "../styled/Container";
import HeaderMobileMenu from "./HeaderMobileMenu";
import { UserOptionsMenuKeys } from "./UserOptionsMenu";

export interface IHeaderMobileProps {
    user: IUser;
    onSelect: (key: UserOptionsMenuKeys) => void;
}

const HeaderMobile: React.FC<IHeaderMobileProps> = (props) => {
    const { user, onSelect } = props;

    return (
        <StyledHeaderContainer>
            <StyledContainer s={{ flex: 1 }}>
                <Typography.Title
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
            <StyledContainer s={{ marginLeft: "16px" }}>
                <HeaderMobileMenu user={user} onSelect={onSelect} />
            </StyledContainer>
        </StyledHeaderContainer>
    );
};

export default HeaderMobile;

const StyledHeaderContainer = styled.div({
    display: "flex",
    width: "100%",
    padding: "16px 16px",
    borderBottom: "1px solid #d9d9d9",
});

const StyledLink = styled(Link)({ color: "inherit !important" });
