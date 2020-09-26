import { LogoutOutlined } from "@ant-design/icons";
import styled from "@emotion/styled";
import { Button, Dropdown, Menu, Typography } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logoutUserOperationAction } from "../../redux/operations/session/logoutUser";
import SessionSelectors from "../../redux/session/selectors";
import { AppDispatch } from "../../redux/types";
import ItemAvatar from "../ItemAvatar";
import StyledContainer from "../styled/Container";
import theme from "../theme";

const HeaderMobile: React.FC<{}> = () => {
    const dispatch: AppDispatch = useDispatch();
    const user = useSelector(SessionSelectors.assertGetUser);

    const onLogout = () => {
        dispatch(logoutUserOperationAction());
    };

    const onSelectAvatarMenu = (event) => {
        if (event.key === "logout") {
            onLogout();
        }
    };

    const avatarMenuOverlay = (
        <Menu onClick={onSelectAvatarMenu} style={{ minWidth: "120px" }}>
            <Menu.Item key="logout">
                <StyledContainer
                    s={{ color: "rgb(255, 77, 79)", alignItems: "center" }}
                >
                    <LogoutOutlined />
                    <StyledContainer s={{ flex: 1, marginLeft: "10px" }}>
                        Logout
                    </StyledContainer>
                </StyledContainer>
            </Menu.Item>
        </Menu>
    );

    return (
        <StyledHeaderContainer>
            <StyledContainer s={{ flex: 1 }}>
                <Typography.Title level={4} style={{ marginBottom: 0 }}>
                    Softkave
                </Typography.Title>
            </StyledContainer>
            <StyledContainer s={{ marginLeft: "16px" }}>
                <Dropdown overlay={avatarMenuOverlay} trigger={["click"]}>
                    <StyledAvatarButton>
                        <ItemAvatar
                            clickable
                            size="small"
                            onClick={() => null}
                            color={user.color || theme.colors.defaults.avatar}
                        />
                    </StyledAvatarButton>
                </Dropdown>
            </StyledContainer>
        </StyledHeaderContainer>
    );
};

export default HeaderMobile;

const StyledHeaderContainer = styled.div({
    display: "flex",
    width: "100%",
    padding: "16px 16px",
});

const StyledAvatarButton = styled(Button)({
    border: "none",
    backgroundColor: "inherit",
    boxShadow: "none",
    padding: 0,
});
