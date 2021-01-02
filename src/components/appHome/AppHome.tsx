import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { IUser } from "../../models/user/user";
import OrgBoardContainer from "../board/OrgBoardContainer";
import FeedbackFormModal from "../feedback/FeedbackFormModal";
import Message from "../Message";
import Notification from "../notification/Notification";
import EditOrgFormInDrawer from "../org/EditOrgFormInDrawer";
import OrgsListContainer from "../org/OrgsListContainer";
import RenderForDevice from "../RenderForDevice";
import StyledContainer from "../styled/Container";
import AppHomeDesktop from "./AppHomeDesktop";
import HeaderMobile from "./HeaderMobile";
import { UserOptionsMenuKeys } from "./UserOptionsMenu";

export interface IAppHomeProps {
    user: IUser;
    showAppMenu: boolean;
    showOrgForm: boolean;
    rootBlocksLoaded: boolean;
    toggleMenu: () => void;
    closeNewOrgForm: () => void;
    onLogout: () => void;
}

const AppHome: React.FC<IAppHomeProps> = (props) => {
    const {
        user,
        showAppMenu,
        showOrgForm,
        rootBlocksLoaded,
        closeNewOrgForm,
        onLogout,
    } = props;

    const [showFeedbackForm, setShowFeedbackForm] = React.useState(false);

    const toggleFeedbackForm = React.useCallback(() => {
        setShowFeedbackForm(!showFeedbackForm);
    }, [showFeedbackForm]);

    const renderNotification = (isMobile: boolean) => (
        <Notification isMobile={isMobile} />
    );

    const onSelect = (key: UserOptionsMenuKeys) => {
        switch (key) {
            case UserOptionsMenuKeys.Logout:
                onLogout();
                break;

            case UserOptionsMenuKeys.SendFeedback:
                toggleFeedbackForm();
                break;
        }
    };

    const mobile = () => (
        <StyledContainer s={{ flexDirection: "column", height: "100%" }}>
            <HeaderMobile user={user} onSelect={onSelect} />
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

    const renderEmpty = (str: string = "Select an organization or request") => (
        <Message message={str} />
    );

    const desktop = () => (
        <StyledContainer s={{ height: "100%", overflow: "hidden" }}>
            {showAppMenu && <AppHomeDesktop user={user} onSelect={onSelect} />}
            {showOrgForm && (
                <EditOrgFormInDrawer visible onClose={closeNewOrgForm} />
            )}
            <Switch>
                <Route
                    exact
                    path="/app/notifications"
                    render={() => renderEmpty("Select a request")}
                />
                <Route
                    path="/app/notifications/*"
                    render={() => renderNotification(false)}
                />
                <Route
                    exact
                    path="/app/orgs"
                    render={() => renderEmpty("Select an organization")}
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
        <React.Fragment>
            {showFeedbackForm && (
                <FeedbackFormModal visible onCancel={toggleFeedbackForm} />
            )}
            <RenderForDevice
                renderForDesktop={desktop}
                renderForMobile={mobile}
            />
        </React.Fragment>
    );
};

export default AppHome;
