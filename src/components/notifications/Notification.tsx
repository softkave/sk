import styled from "@emotion/styled";
import { Button, Icon, Typography } from "antd";
import React from "react";
import { useDispatch, useStore } from "react-redux";
import { useHistory, useRouteMatch } from "react-router";
import {
  notificationStatus,
  NotificationStatusText
} from "../../models/notification/notification";
import { getNotification } from "../../redux/notifications/selectors";
import respondToNotificationOperationFunc from "../../redux/operations/notification/respondToNotification";
import {
  getOperationLastError,
  isOperationStartedOrPending
} from "../../redux/operations/operation";
import { respondToNotificationOperationID } from "../../redux/operations/operationIDs";
import { getOperationWithIDForResource } from "../../redux/operations/selectors";
import { getSignedInUserRequired } from "../../redux/session/selectors";
import { IReduxState } from "../../redux/store";
import FormError from "../form/FormError";
import { getFullBaseNavPath } from "../layout/NavigationMenuList";
import { INotificationsPathParams } from "./N";
import { getNotificationLatestStatus, isNotificationExpired } from "./utils";

const Notification: React.SFC<{}> = props => {
  const history = useHistory();
  const routeMatch = useRouteMatch<INotificationsPathParams>()!;
  const store = useStore<IReduxState>();
  const dispatch = useDispatch();
  const state = store.getState();
  const user = getSignedInUserRequired(state);
  const currentNotificationID =
    routeMatch && routeMatch.params
      ? routeMatch.params.notificationID
      : undefined;

  if (!currentNotificationID) {
    history.push(getFullBaseNavPath());
    return null;
  }

  const notification = getNotification(state, currentNotificationID);
  const isNotificationLoaded = !!notification;

  if (!isNotificationLoaded) {
    return null;
  }

  const onRespond = (selectedResponse: NotificationStatusText) => {
    respondToNotificationOperationFunc(state, dispatch, {
      user,
      response: selectedResponse,
      request: notification
    });
  };

  const renderNotificationResponse = () => {
    const response = getNotificationLatestStatus(notification);
    const notificationExpired = isNotificationExpired(notification);

    if (response) {
      const hasRespondedToNotification =
        response.status === notificationStatus.accepted ||
        response.status === notificationStatus.declined;

      const isNotificationRevoked =
        response.status === notificationStatus.revoked;

      return (
        <React.Fragment>
          {hasRespondedToNotification && (
            <Typography.Paragraph>
              You - <Typography.Text strong>{response.status}</Typography.Text>
            </Typography.Paragraph>
          )}
          {isNotificationRevoked && (
            <Typography.Paragraph>
              This request has been revoked
            </Typography.Paragraph>
          )}
        </React.Fragment>
      );
    } else if (notificationExpired) {
      return (
        <Typography.Paragraph>This request has expired</Typography.Paragraph>
      );
    } else {
      const operation = getOperationWithIDForResource(
        state,
        respondToNotificationOperationID,
        currentNotificationID
      );

      const isResponseLoading = isOperationStartedOrPending(operation);
      const responseError = getOperationLastError(operation);

      return (
        <React.Fragment>
          {isResponseLoading && <Icon type="loading" />}
          {responseError && <FormError error={responseError} />}
          {!isResponseLoading && (
            <Button.Group>
              <Button onClick={() => onRespond(notificationStatus.accepted)}>
                Accept Request
              </Button>
              <Button onClick={() => onRespond(notificationStatus.declined)}>
                Decline Request
              </Button>
            </Button.Group>
          )}
        </React.Fragment>
      );
    }
  };

  return (
    <StyledNotificationBody>
      <StyledNotificationBodyHead>
        <Typography.Title>
          Collaboration Request From {notification.from.blockName}
        </Typography.Title>
        <span>{new Date(notification.createdAt).toDateString()}</span>
      </StyledNotificationBodyHead>
      <p>{notification.body}</p>
      {renderNotificationResponse()}
    </StyledNotificationBody>
  );
};

export default Notification;

const StyledNotificationBody = styled.div({
  padding: "1em",
  backgroundColor: "white",
  height: "100%"
});

const StyledNotificationBodyHead = styled.div({
  marginBottom: "1em"
});
