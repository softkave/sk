import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import OrgBoardContainer from "../board/OrgBoardContainer";
import Notification from "../notification/Notification";
import EditOrgFormInDrawer from "../org/EditOrgFormInDrawer";
import OrgsListContainer from "../org/OrgsListContainer";
import RenderForDevice from "../RenderForDevice";
import StyledContainer from "../styled/Container";
import HeaderMobile from "./HeaderMobile";
import LayoutMenuDesktop from "./LayoutMenuDesktop";

export interface IMainLayoutProps {
    showAppMenu: boolean;
    showOrgForm: boolean;
    rootBlocksLoaded: boolean;
    toggleMenu: () => void;
    closeNewOrgForm: () => void;
}

const MainLayout: React.FC<IMainLayoutProps> = (props) => {
    const {
        showAppMenu,
        showOrgForm,
        closeNewOrgForm,
        rootBlocksLoaded,
    } = props;

    const renderNotification = (isMobile: boolean) => (
        <Notification isMobile={isMobile} />
    );

    const mobile = () => (
        <StyledContainer s={{ flexDirection: "column", height: "100%" }}>
            <HeaderMobile />
            <StyledContainer s={{ flex: 1, overflow: "hidden" }}>
                <Switch>
                    <Route
                        path="/app/notifications/*"
                        render={() => renderNotification(true)}
                    />
                    <Route
                        exact
                        path="/app/organizations"
                        component={OrgsListContainer}
                    />
                    <Route
                        path="/app/organizations/*"
                        render={() => {
                            return (
                                <OrgsListContainer
                                    hijackRender={() => {
                                        // return <span />;
                                        if (rootBlocksLoaded) {
                                            return <OrgBoardContainer />;
                                        }

                                        return <React.Fragment />;
                                    }}
                                />
                            );
                        }}
                    />
                    <Route
                        exact
                        path="*"
                        render={() => <Redirect to="/app/organizations" />}
                    />
                </Switch>
            </StyledContainer>
        </StyledContainer>
    );

    const desktop = () => (
        <StyledContainer s={{ height: "100%", overflow: "hidden" }}>
            {showAppMenu && <LayoutMenuDesktop />}
            {showOrgForm && (
                <EditOrgFormInDrawer visible onClose={closeNewOrgForm} />
            )}
            <Switch>
                <Route
                    path="/app/notifications/*"
                    render={() => renderNotification(false)}
                />
                <Route
                    path="/app/organizations/*"
                    render={() => {
                        if (rootBlocksLoaded) {
                            return <OrgBoardContainer />;
                        }

                        return null;
                    }}
                />
                <Route
                    exact
                    path="*"
                    render={() => <Redirect to="/app/organizations" />}
                />
            </Switch>
        </StyledContainer>
    );

    return (
        <RenderForDevice renderForDesktop={desktop} renderForMobile={mobile} />
    );
};

export default MainLayout;
