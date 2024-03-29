import { LoadingOutlined } from "@ant-design/icons";
import { css } from "@emotion/css";
import { unwrapResult } from "@reduxjs/toolkit";
import { Button, message, Space, Typography } from "antd";
import assert from "assert";
import React from "react";
import { ArrowLeft } from "react-feather";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory, useRouteMatch } from "react-router";
import { appLoggedInPaths, appRequestsPaths } from "../../models/app/routes";
import {
    CollaborationRequestResponse,
    CollaborationRequestStatusType,
    ICollaborationRequest,
} from "../../models/collaborationRequest/types";
import { appMessages } from "../../models/messages";
import CollaborationRequestSelectors from "../../redux/collaborationRequests/selectors";
import { ILoadingState } from "../../redux/key-value/types";
import { markRequestReadOpAction } from "../../redux/operations/collaborationRequest/markRequestRead";
import { respondToRequestOpAction } from "../../redux/operations/collaborationRequest/respondToRequest";
import { AppDispatch, IAppState } from "../../redux/types";
import CollaborationRequestStatus from "../collaborator/CollaborationRequestStatus";
import { getRequestStatus } from "../collaborator/utils";
import Message from "../PageMessage";
import FormFieldError from "../utils/form/FormFieldError";

export interface INotificationProps {}

const Notification: React.FC<INotificationProps> = (props) => {
  const history = useHistory();
  const dispatch: AppDispatch = useDispatch();
  const routeMatch = useRouteMatch<{ requestId: string }>(appRequestsPaths.requestSelector);
  const currentNotificationId =
    routeMatch && routeMatch.params ? routeMatch.params.requestId : undefined;

  const notification = useSelector<IAppState, ICollaborationRequest | undefined>((state) =>
    currentNotificationId
      ? CollaborationRequestSelectors.getOne(state, currentNotificationId)
      : undefined
  );

  const [loadingState, setLoadingState] = React.useState<ILoadingState>();

  const onBack = React.useCallback(() => {
    history.push(appLoggedInPaths.requests);
  }, [history]);

  React.useEffect(() => {
    if (notification && !notification.readAt) {
      dispatch(markRequestReadOpAction({ requestId: notification.customId }));
    }
  }, [notification, dispatch]);

  if (!currentNotificationId) {
    return <Redirect to={appLoggedInPaths.requests} />;
  }

  const isNotificationLoaded = !!notification;

  if (!isNotificationLoaded) {
    return <Message message="Collaboration request not found" />;
  }

  const onRespond = async (selectedResponse: CollaborationRequestResponse) => {
    assert(notification, appMessages.collaborationRequestNotFound);
    const result = await dispatch(
      respondToRequestOpAction({
        response: selectedResponse,
        requestId: notification.customId,
      })
    );

    const op = unwrapResult(result);
    setLoadingState(op);

    if (op.error) {
      message.error("Error sending response");
    } else {
      message.success("Response sent successfully");
    }
  };

  const renderNotificationResponse = () => {
    const status = getRequestStatus(notification!);

    if (status === CollaborationRequestStatusType.Pending) {
      const isResponseLoading = loadingState?.isLoading;
      const responseError = loadingState?.error;

      return (
        <React.Fragment>
          {isResponseLoading && <LoadingOutlined />}
          {responseError && <FormFieldError error={responseError} />}
          {!isResponseLoading && (
            <Space size="large">
              <Button
                danger
                type="primary"
                onClick={() => onRespond(CollaborationRequestStatusType.Declined)}
              >
                Decline Request
              </Button>
              <Button
                type="primary"
                onClick={() => onRespond(CollaborationRequestStatusType.Accepted)}
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
        display: "flex",
        padding: "0 16px",
        height: "100%",
        width: "100%",
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
          <Typography.Title level={1} style={{ fontSize: "16px", marginBottom: "4px" }}>
            Collaboration Request From {notification!.from!.workspaceName}
          </Typography.Title>
          <Typography.Text>{new Date(notification!.createdAt).toDateString()}</Typography.Text>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <Typography.Paragraph style={{ fontSize: "16px" }} type="secondary">
          You have been invited by <Typography.Text>{notification?.from.userName}</Typography.Text>{" "}
          to collaborate in <Typography.Text>{notification?.from.workspaceName}</Typography.Text>
        </Typography.Paragraph>
        {renderNotificationResponse()}
      </div>
    </div>
  );
};

export default Notification;
