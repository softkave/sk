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

export interface IMainDesktopProps {
    showAppMenu: boolean;
    showOrgForm: boolean;
    rootBlocksLoaded: boolean;
    toggleMenu: () => void;
    closeNewOrgForm: () => void;
}

const MainDesktop: React.FC<IMainDesktopProps> = (props) => {
    const {
        showAppMenu,
        showOrgForm,
        closeNewOrgForm,
        rootBlocksLoaded,
    } = props;

    const mobile = () => (
        <StyledContainer s={{ flexDirection: "column", height: "100%" }}>
            <HeaderMobile />
            <StyledContainer s={{ flex: 1, overflow: "hidden" }}>
                <Switch>
                    <Route
                        path="/app/notifications/*"
                        component={Notification}
                    />
                    <Route
                        exact
                        path="/app/organizations"
                        component={OrgsListContainer}
                    />
                    <Route
                        exact
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
        </StyledContainer>
    );

    const desktop = () => (
        <StyledContainer s={{ height: "100%", overflow: "hidden" }}>
            {showAppMenu && <LayoutMenuDesktop />}
            {showOrgForm && (
                <EditOrgFormInDrawer visible onClose={closeNewOrgForm} />
            )}
            <Switch>
                <Route path="/app/notifications/*" component={Notification} />
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

export default MainDesktop;
