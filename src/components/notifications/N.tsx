import { Empty } from "antd";
import React from "react";
import Media from "react-media";
import { useDispatch, useStore } from "react-redux";
import { useHistory, useRouteMatch } from "react-router";
import { INotification } from "../../models/notification/notification";
import { getNotificationsAsArray } from "../../redux/notifications/selectors";
import loadUserNotificationsOperationFunc from "../../redux/operations/notification/loadUserNotifications";
import { loadUserNotificationsOperationID } from "../../redux/operations/operationIDs";
import { getSignedInUserRequired } from "../../redux/session/selectors";
import { IReduxState } from "../../redux/store";
import StyledCenterContainer from "../styled/CenterContainer";
import theme from "../theme";
import OperationHelper, {
  IOperationHelperDerivedProps
} from "../utils/OperationHelper";
import Notification from "./Notification";
import NotificationList from "./NotificationList";

export interface INotificationsPathParams {
  notificationID?: string;
}

const Notifications: React.SFC<{}> = props => {
  const history = useHistory();
  const routeMatch = useRouteMatch<INotificationsPathParams>()!;
  const store = useStore<IReduxState>();
  const dispatch = useDispatch();
  const state = store.getState();
  const user = getSignedInUserRequired(state);
  const areNotificationsLoaded = Array.isArray(user.notifications);
  const notifications = getNotificationsAsArray(
    state,
    user.notifications || []
  );
  const userHasNoNotifications = notifications.length === 0;
  const currentNotificationID =
    routeMatch && routeMatch.params
      ? routeMatch.params.notificationID
      : undefined;

  const onClickNotification = (notification: INotification) => {
    history.push(`${routeMatch.url}/${notification.customId}`);
  };

  const loadNotifications = (helperProps: IOperationHelperDerivedProps) => {
    const shouldLoadNotifications = () => {
      return (
        !areNotificationsLoaded &&
        !(helperProps.isLoading || helperProps.isError)
      );
    };

    if (shouldLoadNotifications()) {
      loadUserNotificationsOperationFunc(state, dispatch, { user });
    }
  };

  const renderEmptyList = () => {
    return (
      <StyledCenterContainer>
        <Empty description="You currently have no notifications." />
      </StyledCenterContainer>
    );
  };

  const renderNotificationList = () => {
    return (
      <NotificationList
        currentNotificationID={currentNotificationID}
        notifications={notifications}
        onClickNotification={onClickNotification}
      />
    );
  };

  const renderCurrentNotification = () => {
    return <Notification />;
  };

  const renderCurrentNotificationForDesktop = () => {
    if (currentNotificationID) {
      return renderCurrentNotification();
    }

    return null;
  };

  const renderNotificationsForMobile = () => {
    if (currentNotificationID) {
      return renderCurrentNotification();
    }

    return renderNotificationList();
  };

  const renderNotificationsForDesktop = () => {
    return (
      <div>
        <div>{renderNotificationList()}</div>
        <div>{renderCurrentNotificationForDesktop()}</div>
      </div>
    );
  };

  // TODO: Should we refactor this, it is used in multiple places?
  const render = () => {
    if (userHasNoNotifications) {
      return renderEmptyList();
    }

    return (
      <Media queries={{ mobile: `(min-width: ${theme.breakpoints.md})` }}>
        {matches => (
          <React.Fragment>
            {matches.mobile && renderNotificationsForMobile()}
            {!matches.mobile && renderNotificationsForDesktop()}
          </React.Fragment>
        )}
      </Media>
    );
  };

  return (
    <OperationHelper
      operationID={loadUserNotificationsOperationID}
      render={render}
      loadFunc={loadNotifications}
    />
  );
};

export default Notifications;
