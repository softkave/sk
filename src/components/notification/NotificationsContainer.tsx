import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { INotification } from "../../models/notification/notification";
import { getNotificationsAsArray } from "../../redux/notifications/selectors";
import loadUserNotificationsOperation from "../../redux/operations/notification/loadUserNotifications";
import markNotificationReadOperation from "../../redux/operations/notification/markNotificationRead";
import { loadUserNotificationsOperationID } from "../../redux/operations/operationIDs";
import { getFirstOperationWithID } from "../../redux/operations/selectors";
import { getSignedInUserRequired } from "../../redux/session/selectors";
import { IReduxState } from "../../redux/store";
import { setCurrentNotification } from "../../redux/view/actions";
import { getCurrentNotification } from "../../redux/view/selectors";
import getViewFromOperations from "../view/getViewFromOperations";
import ViewManager from "../view/ViewManager";
import Notifications from "./Notifications";

function mapStateToProps(state) {
  return state;
}

function mapDispatchToProps(dispatch) {
  return { dispatch };
}

function mergeProps(state: IReduxState, { dispatch }: { dispatch: Dispatch }) {
  const user = getSignedInUserRequired(state);
  const notifications = Array.isArray(user!.notifications)
    ? getNotificationsAsArray(state, user!.notifications)
    : undefined;
  const loadNotificationsOp = getFirstOperationWithID(
    state,
    loadUserNotificationsOperationID
  );

  const onClickNotification = (notification: INotification) => {
    markNotificationReadOperation(state, dispatch, user, notification);
    dispatch(setCurrentNotification(notification));
  };

  const views = [
    {
      viewName: "loading",
      render() {
        return "Loading";
      }
    },
    {
      viewName: "error",
      render() {
        return "An error occurred";
      }
    },
    {
      viewName: "ready",
      render() {
        const currentNotification = getCurrentNotification(state);

        return (
          <Notifications
            notifications={notifications!}
            onClickNotification={onClickNotification}
            user={user}
            currentNotificationID={currentNotification!.customId}
          />
        );
      }
    }
  ];

  const currentView = getViewFromOperations([loadNotificationsOp]);
  const onMount = () => {
    if (!Array.isArray(user.notifications)) {
      loadUserNotificationsOperation(state, dispatch, user);
    }
  };

  return {
    views,
    onMount,
    currentViewName: currentView.viewName
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(ViewManager);
