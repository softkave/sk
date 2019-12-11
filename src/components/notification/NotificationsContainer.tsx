import React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { INotification } from "../../models/notification/notification";
import { getNotificationsAsArray } from "../../redux/notifications/selectors";
import loadUserNotificationsOperationFunc from "../../redux/operations/notification/loadUserNotifications";
import markNotificationReadOperationFunc from "../../redux/operations/notification/markNotificationRead";
import { loadUserNotificationsOperationID } from "../../redux/operations/operationIDs";
import { getFirstOperationWithID } from "../../redux/operations/selectors";
import { getSignedInUserRequired } from "../../redux/session/selectors";
import { IReduxState } from "../../redux/store";
import { setCurrentNotification } from "../../redux/view/actions";
import { getCurrentNotification } from "../../redux/view/selectors";
import GeneralError from "../GeneralError";
import Loading from "../Loading";
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
    markNotificationReadOperationFunc(state, dispatch, { notification });
    dispatch(setCurrentNotification(notification));
  };

  const views = [
    {
      viewName: "loading",
      render() {
        return <Loading />;
      }
    },
    {
      viewName: "error",
      render() {
        return <GeneralError />;
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
            currentNotificationID={
              currentNotification && currentNotification.customId
            }
          />
        );
      }
    }
  ];

  const currentView = getViewFromOperations([loadNotificationsOp]);
  const onMount = () => {
    if (!Array.isArray(user.notifications)) {
      loadUserNotificationsOperationFunc(state, dispatch, { user });
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
