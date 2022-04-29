import React from "react";
import { useHistory } from "react-router";
import { appLoggedInPaths } from "../../models/app/routes";
import FeedbackFormModal from "../feedback/FeedbackFormModal";
import EditOrgFormInDrawer from "../organization/OrganizationFormDrawer";
import RenderForDevice from "../RenderForDevice";
import AppHomeDesktop from "./AppHomeDesktop";
import AppHomeMobile from "./AppHomeMobile";
import NotificationsPermissionContainer from "./NotificationsPermissionContainer";
import { UserOptionsMenuKeys } from "./UserOptionsMenu";

export interface IAppHomeProps {
  showAppMenu: boolean;
  showOrgForm: boolean;
  closeNewOrgForm: () => void;
  onLogout: () => void;
}

const AppHome: React.FC<IAppHomeProps> = (props) => {
  const { showAppMenu, showOrgForm, closeNewOrgForm, onLogout } = props;
  const history = useHistory();
  const [showFeedbackForm, setShowFeedbackForm] = React.useState(false);
  const toggleFeedbackForm = React.useCallback(() => {
    setShowFeedbackForm(!showFeedbackForm);
  }, [showFeedbackForm]);

  const onSelect = (key: UserOptionsMenuKeys) => {
    switch (key) {
      case UserOptionsMenuKeys.Logout:
        onLogout();
        break;
      case UserOptionsMenuKeys.SendFeedback:
        toggleFeedbackForm();
        break;
      case UserOptionsMenuKeys.UserSettings:
        history.push(appLoggedInPaths.settings);
        break;
      case UserOptionsMenuKeys.Organizations:
        history.push(appLoggedInPaths.organizations);
        break;
      case UserOptionsMenuKeys.Requests:
        history.push(appLoggedInPaths.requests);
        break;
    }
  };

  const mobile = () => <AppHomeMobile onSelect={onSelect} />;
  const desktop = () => (
    <AppHomeDesktop onSelect={onSelect} showAppMenu={showAppMenu} />
  );

  return (
    <React.Fragment>
      <NotificationsPermissionContainer />
      {showFeedbackForm && (
        <FeedbackFormModal visible onCancel={toggleFeedbackForm} />
      )}
      {showOrgForm && <EditOrgFormInDrawer visible onClose={closeNewOrgForm} />}
      <RenderForDevice renderForDesktop={desktop} renderForMobile={mobile} />
    </React.Fragment>
  );
};

export default AppHome;
