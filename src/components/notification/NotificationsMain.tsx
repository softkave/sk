import React from "react";
import { useDispatch, useStore } from "react-redux";
import { useHistory } from "react-router";
import { getNotificationsAsArray } from "../../redux/notifications/selectors";
import loadUserNotificationsOperationFunc from "../../redux/operations/notification/loadUserNotifications";
import { loadUserNotificationsOperationID } from "../../redux/operations/operationIDs";
import { getSignedInUserRequired } from "../../redux/session/selectors";
import { IReduxState } from "../../redux/store";
import GeneralError from "../GeneralError";
import OperationHelper, {
  IOperationHelperDerivedProps
} from "../utils/OperationHelper";
import Notifications from "./Notifications";

const NotificationsMain: React.SFC<{}> = props => {
  const history = useHistory();
  const store = useStore<IReduxState>();
  const dispatch = useDispatch();
  const state = store.getState();
  const user = getSignedInUserRequired(state);
  const areNotificationsLoaded = Array.isArray(user.notifications);
  const notifications = getNotificationsAsArray(
    state,
    user.notifications || []
  );

  const loadOrganizations = (helperProps: IOperationHelperDerivedProps) => {
    const shouldLoadOrganizations = () => {
      return (
        !areNotificationsLoaded &&
        !(helperProps.isLoading || helperProps.isError)
      );
    };

    if (shouldLoadOrganizations()) {
      loadUserNotificationsOperationFunc(state, dispatch, { user });
    }
  };

  const getSelectedNotification = () => {};

  const render = () => {
    if (areNotificationsLoaded) {
      return (
        <Notifications
          user={user}
          currentNotificationID={}
          notifications={notifications}
          onClickNotification={}
        />
      );
    }

    return <GeneralError />;
  };

  return (
    <OperationHelper
      operationID={loadUserNotificationsOperationID}
      render={render}
      loadFunc={loadOrganizations}
    />
  );

  return null;
};

export default NotificationsMain;
