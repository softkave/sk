import styled from "@emotion/styled";
import { Empty } from "antd";
import React from "react";
import Media from "react-media";
import { useSelector } from "react-redux";
import { useHistory, useRouteMatch } from "react-router";
import { INotification } from "../../models/notification/notification";
import { getNotificationsAsArray } from "../../redux/notifications/selectors";
import loadUserNotificationsOperationFunc from "../../redux/operations/notification/loadUserNotifications";
import { loadUserNotificationsOperationID } from "../../redux/operations/operationIDs";
import { getSignedInUserRequired } from "../../redux/session/selectors";
import { IReduxState } from "../../redux/store";
import StyledCenterContainer from "../styled/CenterContainer";
import StyledFlexFillContainer from "../styled/FillContainer";
import theme from "../theme";
import OH from "../utils/OH";
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
  const routeMatch = useRouteMatch()!;
  const currentNotificationRouteMatch = useRouteMatch<INotificationsPathParams>(
    "/app/notifications/:notificationID"
  );
  const user = useSelector(getSignedInUserRequired);
  const areNotificationsLoaded = Array.isArray(user.notifications);
  const notifications = useSelector<IReduxState, INotification[]>(state =>
    getNotificationsAsArray(state, user.notifications || [])
  );
  const userHasNoNotifications = notifications.length === 0;
  const currentNotificationID =
    currentNotificationRouteMatch && currentNotificationRouteMatch.params
      ? currentNotificationRouteMatch.params.notificationID
      : undefined;

  const onClickNotification = (notification: INotification) => {
    history.push(`${routeMatch.url}/${notification.customId}`);
  };

  const loadNotifications = (helperProps: IOperationHelperDerivedProps) => {
    const shouldLoadNotifications = () => {
      return !!!helperProps.operation;
    };

    if (shouldLoadNotifications()) {
      loadUserNotificationsOperationFunc();
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
      <StyledDesktopNotificationContainer>
        <StyledDesktopNotificationListContainer>
          {renderNotificationList()}
        </StyledDesktopNotificationListContainer>
        <StyledDesktopNotificationBodyContainer>
          {renderCurrentNotificationForDesktop()}
        </StyledDesktopNotificationBodyContainer>
      </StyledDesktopNotificationContainer>
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
    <OH
      operationID={loadUserNotificationsOperationID}
      render={render}
      loadFunc={loadNotifications}
    />
  );
};

export default Notifications;

// TODO: Global header for desktop
// TODO: Shadow header for mobile

const StyledDesktopNotificationContainer = styled.div({
  display: "flex",
  flex: 1,
  width: "100%",
  height: "100%",
  padding: "26px 0",
  boxSizing: "border-box"
});

const StyledDesktopNotificationBodyContainer = styled.div({
  display: "flex",
  flex: 1
});

const StyledDesktopNotificationListContainer = styled.div({
  width: "300px"
  // padding: "0 16px",
  // boxSizing: "border-box"
});
