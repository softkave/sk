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
import SingleOperationHelper, {
  ISingleOperationHelperDerivedProps,
} from "../OperationHelper";
import StyledContainer from "../styled/Container";
import theme from "../theme";
import Notification from "./Notification";
import NotificationList from "./NotificationList";
import { INotificationsPathParams } from "./utils";

const Notifications: React.FC<{}> = (props) => {
  const history = useHistory();
  const routeMatch = useRouteMatch()!;
  const currentNotificationRouteMatch = useRouteMatch<INotificationsPathParams>(
    "/app/notifications/:notificationID"
  );
  const user = useSelector(getSignedInUserRequired);
  const notifications = useSelector<IReduxState, INotification[]>((state) =>
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

  const loadNotifications = (
    helperProps: ISingleOperationHelperDerivedProps
  ) => {
    const shouldLoadNotifications = () => {
      return !!!helperProps.operation;
    };

    if (shouldLoadNotifications()) {
      loadUserNotificationsOperationFunc();
    }
  };

  const renderEmptyList = () => {
    return (
      <StyledContainer
        s={{
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Empty description="You currently have no notifications." />
      </StyledContainer>
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
    let content: React.ReactNode = null;

    if (currentNotificationID) {
      content = renderCurrentNotification();
    } else {
      content = renderNotificationList();
    }

    return (
      <StyledContainer s={{ marginTop: "16px" }}>{content}</StyledContainer>
    );
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
      <Media queries={{ mobile: `(max-width: ${theme.breakpoints.sm}px)` }}>
        {(matches) => (
          <React.Fragment>
            {matches.mobile && renderNotificationsForMobile()}
            {!matches.mobile && renderNotificationsForDesktop()}
          </React.Fragment>
        )}
      </Media>
    );
  };

  return (
    <SingleOperationHelper
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
  boxSizing: "border-box",
  marginTop: "20px",
});

const StyledDesktopNotificationBodyContainer = styled.div({
  display: "flex",
  flex: 1,
});

const StyledDesktopNotificationListContainer = styled.div({
  minWidth: "400px",
});
