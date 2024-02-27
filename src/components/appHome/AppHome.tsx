import React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import { appLoggedInPaths } from "../../models/app/routes";
import KeyValueSelectors from "../../redux/key-value/selectors";
import { KeyValueKeys } from "../../redux/key-value/types";
import { logoutUserOpAction } from "../../redux/operations/session/logoutUser";
import { IAppState } from "../../redux/types";
import FeedbackFormModal from "../feedback/FeedbackFormModal";
import { useAppDispatch } from "../hooks/redux";
import RenderForDevice from "../RenderForDevice";
import AppHomeDesktop from "./AppHomeDesktop";
import AppHomeMobile from "./AppHomeMobile";
import NotificationsPermissionContainer from "./NotificationsPermissionContainer";
import { UserOptionsMenuKeys } from "./UserOptionsMenu";

export interface IAppHomeProps {}

const AppHome: React.FC<IAppHomeProps> = (props) => {
  const history = useHistory();
  const [showFeedbackForm, setShowFeedbackForm] = React.useState(false);
  const toggleFeedbackForm = React.useCallback(() => {
    setShowFeedbackForm(!showFeedbackForm);
  }, [showFeedbackForm]);
  const dispatch = useAppDispatch();
  const [showAppMenu] = useSelector((state) =>
    KeyValueSelectors.getMany(state as IAppState, [KeyValueKeys.ShowAppMenu])
  ) as Partial<[boolean]>;

  const onLogout = React.useCallback(() => {
    dispatch(logoutUserOpAction());
  }, [dispatch]);

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
  const desktop = () => <AppHomeDesktop onSelect={onSelect} showAppMenu={showAppMenu} />;

  return (
    <React.Fragment>
      <NotificationsPermissionContainer />
      {showFeedbackForm && <FeedbackFormModal visible onCancel={toggleFeedbackForm} />}
      <RenderForDevice renderForDesktop={desktop} renderForMobile={mobile} />
    </React.Fragment>
  );
};

export default AppHome;
