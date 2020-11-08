import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import OrgBoardContainer from "../board/OrgBoardContainer";
import Notification from "../notification/Notification";
import EditOrgFormInDrawer from "../org/EditOrgFormInDrawer";
import OrgsListContainer from "../org/OrgsListContainer";
import RenderForDevice from "../RenderForDevice";
import StyledContainer from "../styled/Container";
import AppHomeDesktop from "./AppHomeDesktop";
import HeaderMobile from "./HeaderMobile";

export interface IAppHomeProps {
    showAppMenu: boolean;
    showOrgForm: boolean;
    rootBlocksLoaded: boolean;
    toggleMenu: () => void;
    closeNewOrgForm: () => void;
}

const AppHome: React.FC<IAppHomeProps> = (props) => {
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
                        path="/app/orgs"
                        component={OrgsListContainer}
                    />
                    <Route
                        path="/app/orgs/*"
                        render={() => {
                            return (
                                <OrgsListContainer
                                    hijackRender={() => {
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
                        render={() => <Redirect to="/app/orgs" />}
                    />
                </Switch>
            </StyledContainer>
        </StyledContainer>
    );

    const desktop = () => (
        <StyledContainer s={{ height: "100%", overflow: "hidden" }}>
            {showAppMenu && <AppHomeDesktop />}
            {showOrgForm && (
                <EditOrgFormInDrawer visible onClose={closeNewOrgForm} />
            )}
            <Switch>
                <Route
                    path="/app/notifications/*"
                    render={() => renderNotification(false)}
                />
                <Route
                    path="/app/orgs/*"
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
                    render={() => <Redirect to="/app/orgs" />}
                />
            </Switch>
        </StyledContainer>
    );

    return (
        <RenderForDevice renderForDesktop={desktop} renderForMobile={mobile} />
    );
};

export default AppHome;
