import styled from "@emotion/styled";
import { Button, Icon, Typography } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { useHistory, useRouteMatch } from "react-router";
import {
  INotification,
  notificationStatus,
  NotificationStatusText
} from "../../models/notification/notification";
import { getNotification } from "../../redux/notifications/selectors";
import respondToNotificationOperationFunc from "../../redux/operations/notification/respondToNotification";
import IOperation, {
  getOperationLastError,
  isOperationStartedOrPending
} from "../../redux/operations/operation";
import { respondToNotificationOperationID } from "../../redux/operations/operationIDs";
import { getOperationWithIDForResource } from "../../redux/operations/selectors";
import { IReduxState } from "../../redux/store";
import FormError from "../form/FormError";
import { getFullBaseNavPath } from "../layout/path";
import { INotificationsPathParams } from "./N";
import { getNotificationLatestStatus, isNotificationExpired } from "./utils";

const Notification: React.SFC<{}> = props => {
  const history = useHistory();
  const routeMatch = useRouteMatch<INotificationsPathParams>(
    "/app/notifications/:notificationID"
  );
  const currentNotificationID =
    routeMatch && routeMatch.params
      ? routeMatch.params.notificationID
      : undefined;
  const notification = useSelector<IReduxState, INotification>(state =>
    getNotification(state, currentNotificationID!)
  );
  const operation = useSelector<IReduxState, IOperation | undefined>(state =>
    getOperationWithIDForResource(
      state,
      respondToNotificationOperationID,
      currentNotificationID
    )
  );

  if (!currentNotificationID) {
    history.push(getFullBaseNavPath());
    return null;
  }

  const isNotificationLoaded = !!notification;

  if (!isNotificationLoaded) {
    return null;
  }

  const onRespond = (selectedResponse: NotificationStatusText) => {
    respondToNotificationOperationFunc({
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
        <StyledTitle>
          Collaboration Request From {notification.from.blockName}
        </StyledTitle>
        <Typography.Text>
          {new Date(notification.createdAt).toDateString()}
        </Typography.Text>
      </StyledNotificationBodyHead>
      <StyledMessage>{notification.body}</StyledMessage>
      {renderNotificationResponse()}
    </StyledNotificationBody>
  );
};

export default Notification;

const StyledNotificationBody = styled.div({
  padding: "0 16px",
  backgroundColor: "white",
  height: "100%"
});

const StyledNotificationBodyHead = styled.div({
  marginBottom: "32px"
});

const StyledTitle = styled.h1({
  fontSize: "20px !important",
  lineHeight: "42px",
  marginBottom: 0
});

const StyledMessage = styled.p({
  marginBottom: "32px"
});
