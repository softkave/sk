import { LoadingOutlined } from "@ant-design/icons";
import { css } from "@emotion/css";
import { unwrapResult } from "@reduxjs/toolkit";
import { Button, message, Space, Typography } from "antd";
import assert from "assert";
import React from "react";
import { ArrowLeft } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useRouteMatch } from "react-router";
import { ICollaborationRequest } from "../../models/collaborationRequest/types";
import { messages } from "../../models/messages";
import {
  CollaborationRequestResponse,
  CollaborationRequestStatusType,
} from "../../models/notification/notification";
import CollaborationRequestSelectors from "../../redux/collaborationRequests/selectors";
import { respondToRequestOpAction } from "../../redux/operations/collaborationRequest/respondToRequest";
import { AppDispatch, IAppState } from "../../redux/types";
import CollaborationRequestStatus from "../collaborator/CollaborationRequestStatus";
import { getRequestStatus } from "../collaborator/utils";
import FormError from "../forms/FormError";
import useOperation, { getOpData } from "../hooks/useOperation";
import Message from "../Message";

import { INotificationsPathParams } from "./utils";

export interface INotificationProps {}

const Notification: React.FC<INotificationProps> = (props) => {
  const history = useHistory();
  const dispatch: AppDispatch = useDispatch();
  const routeMatch = useRouteMatch<INotificationsPathParams>(
    "/app/notifications/:notificationId"
  );
  const currentNotificationId =
    routeMatch && routeMatch.params
      ? routeMatch.params.notificationId
      : undefined;

  const notification = useSelector<
    IAppState,
    ICollaborationRequest | undefined
  >((state) =>
    currentNotificationId
      ? CollaborationRequestSelectors.getOne(state, currentNotificationId)
      : undefined
  );

  const opStatus = useOperation();
  const onBack = React.useCallback(() => {
    history.push("/app/notifications");
  }, [history]);

  if (!currentNotificationId) {
    history.push("/app/notifications");
    return null;
  }

  const isNotificationLoaded = !!notification;

  if (!isNotificationLoaded) {
    return <Message message="Notification not found." />;
  }

  const onRespond = async (selectedResponse: CollaborationRequestResponse) => {
    assert(notification, messages.collaborationRequestNotFound);
    const result = await dispatch(
      respondToRequestOpAction({
        response: selectedResponse,
        requestId: notification.customId,
        opId: opStatus.opId,
      })
    );

    const op = unwrapResult(result);

    if (!op) {
      return;
    }

    const currentOpStat = getOpData(op);

    if (currentOpStat.isCompleted) {
      message.success("Response sent successfully.");
    } else if (currentOpStat.isError) {
      message.error("Error sending response.");
    }
  };

  const renderNotificationResponse = () => {
    const status = getRequestStatus(notification!);

    if (status === CollaborationRequestStatusType.Pending) {
      const isResponseLoading = opStatus.isLoading;
      const responseError = opStatus.error;

      return (
        <React.Fragment>
          {isResponseLoading && <LoadingOutlined />}
          {responseError && <FormError error={responseError} />}
          {!isResponseLoading && (
            <Space size="large">
              <Button
                danger
                type="primary"
                onClick={() =>
                  onRespond(CollaborationRequestStatusType.Declined)
                }
              >
                Decline Request
              </Button>
              <Button
                type="primary"
                onClick={() =>
                  onRespond(CollaborationRequestStatusType.Accepted)
                }
              >
                Accept Request
              </Button>
            </Space>
          )}
        </React.Fragment>
      );
    }

    return <CollaborationRequestStatus request={notification!} />;
  };

  const renderHeaderPrefixButton = () => {
    return (
      <div style={{ marginRight: "16px", cursor: "pointer" }}>
        <Button className="icon-btn" onClick={onBack}>
          <ArrowLeft />
        </Button>
      </div>
    );
  };

  return (
    <div
      className={css({
        padding: "0 16px",
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
      })}
    >
      <div
        className={css({
          marginBottom: "32px",
          display: "flex",
          marginTop: "16px",
        })}
      >
        <div
          style={{
            marginRight: "16px",
            cursor: "pointer",
            alignItems: "center",
          }}
        >
          {renderHeaderPrefixButton()}
        </div>
        <div style={{ flex: 1, flexDirection: "column" }}>
          <Typography.Title
            level={1}
            style={{ fontSize: "16px", marginBottom: "4px" }}
          >
            Collaboration Request From {notification!.from!.blockName}
          </Typography.Title>
          <Typography.Text>
            {new Date(notification!.createdAt).toDateString()}
          </Typography.Text>
        </div>
      </div>
      <div
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Typography.Paragraph style={{ fontSize: "16px" }} type="secondary">
          You have been invited by{" "}
          <Typography.Text>{notification?.from.name}</Typography.Text> to
          collaborate in{" "}
          <Typography.Text>{notification?.from.blockName}</Typography.Text>
        </Typography.Paragraph>
        {renderNotificationResponse()}
      </div>
    </div>
  );
};

export default Notification;
