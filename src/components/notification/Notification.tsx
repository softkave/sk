import { LoadingOutlined } from "@ant-design/icons";
import styled from "@emotion/styled";
import { unwrapResult } from "@reduxjs/toolkit";
import { Button, message, Typography } from "antd";
import React from "react";
import { ArrowLeft } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useRouteMatch } from "react-router";
import {
  CollaborationRequestStatusType,
  INotification,
} from "../../models/notification/notification";
import { getNotification } from "../../redux/notifications/selectors";
import { respondToNotificationOperationAction } from "../../redux/operations/notification/respondToNotification";
import { AppDispatch, IAppState } from "../../redux/types";
import EmptyMessage from "../EmptyMessage";
import FormError from "../form/FormError";
import useOperation, { getOperationStats } from "../hooks/useOperation";
import { getFullBaseNavPath } from "../layout/path";
import StyledContainer from "../styled/Container";
import {
  getNotificationLatestStatus,
  INotificationsPathParams,
  isNotificationExpired,
} from "./utils";

const Notification: React.FC<{}> = (props) => {
  const history = useHistory();
  const dispatch: AppDispatch = useDispatch();
  const routeMatch = useRouteMatch<INotificationsPathParams>(
    "/app/notifications/:notificationId"
  );
  const currentNotificationId =
    routeMatch && routeMatch.params
      ? routeMatch.params.notificationId
      : undefined;
  const notification = useSelector<IAppState, INotification | undefined>(
    (state) => getNotification(state, currentNotificationId!)
  );

  const opStatus = useOperation();

  if (!currentNotificationId) {
    history.push(getFullBaseNavPath());
    return null;
  }

  const isNotificationLoaded = !!notification;

  if (!isNotificationLoaded) {
    return <EmptyMessage>Notification not found</EmptyMessage>;
  }

  const onRespond = async (
    selectedResponse: CollaborationRequestStatusType
  ) => {
    const result = await dispatch(
      respondToNotificationOperationAction({
        response: selectedResponse,
        request: notification!,
        opId: opStatus.opId,
      })
    );

    const op = unwrapResult(result);

    if (!op) {
      return;
    }

    const currentOpStat = getOperationStats(op);

    if (currentOpStat.isCompleted) {
      message.success("Response sent successfully");
    } else if (currentOpStat.isError) {
      message.error("Error sending response");
    }
  };

  const renderNotificationResponse = () => {
    const response = getNotificationLatestStatus(notification!);
    const notificationExpired = isNotificationExpired(notification!);

    if (response) {
      const hasRespondedToNotification =
        response.status === CollaborationRequestStatusType.Accepted ||
        response.status === CollaborationRequestStatusType.Declined;

      const isNotificationRevoked =
        response.status === CollaborationRequestStatusType.Revoked;

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
      const isResponseLoading = opStatus.isLoading;
      const responseError = opStatus.error;

      return (
        <React.Fragment>
          {isResponseLoading && <LoadingOutlined />}
          {responseError && <FormError error={responseError} />}
          {!isResponseLoading && (
            <Button.Group>
              <Button
                onClick={() =>
                  onRespond(CollaborationRequestStatusType.Accepted)
                }
              >
                Accept Request
              </Button>
              <Button
                onClick={() =>
                  onRespond(CollaborationRequestStatusType.Declined)
                }
              >
                Decline Request
              </Button>
            </Button.Group>
          )}
        </React.Fragment>
      );
    }
  };

  const onBack = () => {
    history.push("/app/notifications");
  };

  return (
    <StyledNotificationBody>
      <StyledNotificationBodyHead>
        <StyledContainer
          s={{ marginRight: "16px", cursor: "pointer", alignItems: "center" }}
          onClick={onBack}
        >
          <ArrowLeft />
        </StyledContainer>
        <StyledContainer s={{ flex: 1, flexDirection: "column" }}>
          <Typography.Title level={4}>
            Collaboration Request From {notification!.from!.blockName}
          </Typography.Title>
          <Typography.Text>
            {new Date(notification!.createdAt).toDateString()}
          </Typography.Text>
        </StyledContainer>
      </StyledNotificationBodyHead>
      <StyledMessage>{notification!.body}</StyledMessage>
      {renderNotificationResponse()}
    </StyledNotificationBody>
  );
};

export default Notification;

const StyledNotificationBody = styled.div({
  padding: "0 16px",
  backgroundColor: "white",
  height: "100%",
});

const StyledNotificationBodyHead = styled.div({
  marginBottom: "32px",
  display: "flex",
});

const StyledMessage = styled.p({
  marginBottom: "32px",
});
