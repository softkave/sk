import React from "react";
import { useHistory } from "react-router";
import { Redirect, Route, Switch } from "react-router-dom";
import { IUser } from "../../models/user/user";
import OrganizationContainer from "../board/OrganizationContainer";
import FeedbackFormModal from "../feedback/FeedbackFormModal";
import Message from "../Message";
import Notification from "../notification/Notification";
import EditOrgFormInDrawer from "../org/EditOrgFormInDrawer";
import OrgsListContainer from "../org/OrgsListContainer";
import RenderForDevice from "../RenderForDevice";
import UserSettings from "../user/UserSettings";
import AppHomeDesktop from "./AppHomeDesktop";
import HeaderMobile from "./HeaderMobile";
import NotificationsPermissionContainer from "./NotificationsPermissionContainer";
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

  const history = useHistory();
  const [showFeedbackForm, setShowFeedbackForm] = React.useState(false);
  const toggleFeedbackForm = React.useCallback(() => {
    setShowFeedbackForm(!showFeedbackForm);
  }, [showFeedbackForm]);

  const renderNotification = () => <Notification />;
  const renderSettings = () => <UserSettings />;
  const onSelect = (key: UserOptionsMenuKeys) => {
    switch (key) {
      case UserOptionsMenuKeys.Logout:
        onLogout();
        break;

      case UserOptionsMenuKeys.SendFeedback:
        toggleFeedbackForm();
        break;

      case UserOptionsMenuKeys.UserSettings:
        history.push("/app/settings");
        break;
    }
  };

  const mobile = () => (
    <div style={{ flexDirection: "column", height: "100%" }}>
      {showOrgForm && <EditOrgFormInDrawer visible onClose={closeNewOrgForm} />}
      <HeaderMobile user={user} onSelect={onSelect} />
      <div style={{ flex: 1, overflow: "hidden" }}>
        <Switch>
          <Route path="/app/notifications/*" render={renderNotification} />
          <Route exact path="/app/orgs" component={OrgsListContainer} />
          <Route
            path="/app/orgs/*"
            render={() => {
              return (
                <OrgsListContainer
                  hijackRender={() => {
                    if (rootBlocksLoaded) {
                      return <OrganizationContainer />;
                    }

                    return <React.Fragment />;
                  }}
                />
              );
            }}
          />
          <Route exact path="/app/settings" render={renderSettings} />
          <Route exact path="*" render={() => <Redirect to="/app/orgs" />} />
        </Switch>
      </div>
    </div>
  );

  const renderEmpty = (str: string = "Select an organization or request") => (
    <Message message={str} />
  );

  const desktop = () => (
    <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>
      {showAppMenu && <AppHomeDesktop user={user} onSelect={onSelect} />}
      {showOrgForm && <EditOrgFormInDrawer visible onClose={closeNewOrgForm} />}
      <Switch>
        <Route
          exact
          path="/app/notifications"
          render={() => renderEmpty("Select a request or notification.")}
        />
        <Route path="/app/notifications/*" render={renderNotification} />
        <Route
          exact
          path="/app/orgs"
          render={() =>
            renderEmpty("Select or create an organization to get started.")
          }
        />
        <Route
          path="/app/orgs/*"
          render={() => {
            if (rootBlocksLoaded) {
              return <OrganizationContainer />;
            }

            return null;
          }}
        />
        <Route exact path="/app/settings" render={renderSettings} />
        <Route exact path="*" render={() => <Redirect to="/app/orgs" />} />
      </Switch>
    </div>
  );

  return (
    <React.Fragment>
      <NotificationsPermissionContainer />
      {showFeedbackForm && (
        <FeedbackFormModal visible onCancel={toggleFeedbackForm} />
      )}
      <RenderForDevice renderForDesktop={desktop} renderForMobile={mobile} />
    </React.Fragment>
  );
};

export default AppHome;
