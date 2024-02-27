import { message, notification as appNotification } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { appMessages } from "../../models/messages";
import { updateClientOpAction } from "../../redux/operations/session/updateClient";
import SessionSelectors from "../../redux/session/selectors";
import { registerPushNotification } from "../../serviceWorkerRegistration";
import UserSessionStorageFuncs, { sessionVariables } from "../../storage/userSession";
import { UnsurportedBrowserError } from "../../utils/errors";
import { devError } from "../../utils/log";
import { supportsNotification } from "../../utils/supports";
import { useAppDispatch } from "../hooks/redux";
import NotificationsPermissionRequest from "./NotificationsPermission";

export interface INotificationsPermissionContainerProps {}

// TODO: track when user explicitly set push notifications to off, and when
// permission is granted but push notifications is not yet setup for whatever
// reason. Also allow the user to disable push notification per device or for
// all devices.
const NotificationsPermissionContainer: React.FC<INotificationsPermissionContainerProps> = (
  props
) => {
  const dispatch = useAppDispatch();
  const user = useSelector(SessionSelectors.getUser);
  const hasUserSeenNotificationsPermissionDialog = UserSessionStorageFuncs.getItem(
    sessionVariables.hasUserSeenNotificationsPermissionDialog,
    "local",
    "boolean"
  );

  const [showDialog, setShowDialog] = React.useState(() => {
    if (!supportsNotification()) {
      return false;
    }

    return (
      user &&
      window.Notification.permission === "default" &&
      !hasUserSeenNotificationsPermissionDialog
    );
  });

  React.useEffect(() => {
    if (!hasUserSeenNotificationsPermissionDialog) {
      // TODO: set in client in the server
      UserSessionStorageFuncs.setItem(
        sessionVariables.hasUserSeenNotificationsPermissionDialog,
        true
      );

      dispatch(
        updateClientOpAction({
          data: {
            hasUserSeenNotificationsPermissionDialog: true,
          },
        })
      );
    }
  }, [hasUserSeenNotificationsPermissionDialog, dispatch]);

  const onClose = () => setShowDialog(false);

  const onRequestPermission = async () => {
    if (!supportsNotification()) {
      appNotification.warning({
        message: appMessages.unsupportedFeatureTitle,
        description: appMessages.unsupportedFeatureMessage,
      });
      return;
    }

    try {
      onClose();
      let permission = window.Notification.permission;
      if (permission !== "granted") {
        permission = await window.Notification.requestPermission();
      }
      if (permission === "granted") {
        const subscription = await registerPushNotification();
        if (subscription) {
          message.success("Push notification setup successfully");
        }
      }
    } catch (error: any) {
      devError(error);
      if (error?.name === UnsurportedBrowserError.name) {
        message.error(error.message);
      }

      message.error("Error setting up push notifications");
    }
  };

  if (user && showDialog) {
    return (
      <NotificationsPermissionRequest
        user={user}
        onClose={onClose}
        onRequestPermission={onRequestPermission}
      />
    );
  }

  return null;
};

export default NotificationsPermissionContainer;
