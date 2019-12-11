import { Icon, notification as uiNotification } from "antd";
import React from "react";
import { connect } from "react-redux";
import { notificationStatus } from "../../models/notification/notification";
import { getNotificationRequired } from "../../redux/notifications/selectors";
import respondToNotificationOperationFunc from "../../redux/operations/notification/respondToNotification";
import {
  isOperationCompleted,
  isOperationError,
  isOperationPending,
  isOperationStarted
} from "../../redux/operations/operation";
import { respondToNotificationOperationID } from "../../redux/operations/operationIDs";
import { getOperationWithIDForResource } from "../../redux/operations/selectors";
import { getSignedInUserRequired } from "../../redux/session/selectors";
import { IReduxState } from "../../redux/store";
import ViewManager from "../view/ViewManager";
import NotificationResponse from "./NotificationResponse";
import NotificationResponseForm from "./NotificationResponseForm";
import NotificationRevoked from "./NotificationRevoked";
import { getNotificationLatestStatus, isNotificationExpired } from "./utils";

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

export interface INotificationResponseContainerProps {
  id: string;
}

function mergeProps(
  state: IReduxState,
  { dispatch },
  props: INotificationResponseContainerProps
) {
  const user = getSignedInUserRequired(state);
  const notification = getNotificationRequired(state, props.id);
  const response = getNotificationLatestStatus(notification);
  const operation = getOperationWithIDForResource(
    state,
    respondToNotificationOperationID,
    props.id
  );

  let currentViewName = "form";

  if (response) {
    if (
      response.status === notificationStatus.accepted ||
      response.status === notificationStatus.declined
    ) {
      currentViewName = "responded";
    } else if (response.status === notificationStatus.revoked) {
      currentViewName = "revoked";
    }
  } else if (!isNotificationExpired(notification)) {
    currentViewName = "revoked";
  } else if (operation) {
    if (isOperationStarted(operation) || isOperationPending(operation)) {
      currentViewName = "loading";
    } else if (isOperationCompleted(operation)) {
      currentViewName = "responded";
    } else if (isOperationError(operation)) {
      currentViewName = "form";

      // TODO: Add correct error message from the operqation error
      uiNotification.error({
        message: "Error responding to notification",
        // description: successMessage,
        duration: 0
      });
    }
  } else {
    currentViewName = "form";
  }

  return {
    currentViewName,
    views: [
      {
        viewName: "responded",
        render() {
          return <NotificationResponse response={response!.status} />;
        }
      },
      {
        viewName: "form",
        render() {
          return (
            <NotificationResponseForm
              onRespond={selectedResponse => {
                // respondToNotificationOperationFunc(state, dispatch, {
                //   user,
                //   response: selectedResponse,
                //   request: notification
                // });
              }}
            />
          );
        }
      },
      {
        viewName: "loading",
        render() {
          return <Icon type="loading" />;
        }
      },
      {
        viewName: "revoked",
        render() {
          return <NotificationRevoked />;
        }
      }
    ]
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(ViewManager);
