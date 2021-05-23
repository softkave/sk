import { message } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateClientOpAction } from "../../redux/operations/session/updateClient";
import SessionSelectors from "../../redux/session/selectors";
import { registerPushNotification } from "../../serviceWorkerRegistration";
import UserSessionStorageFuncs, {
    sessionVariables,
} from "../../storage/userSession";
import { devError } from "../../utils/log";
import NotificationsPermission from "./NotificationsPermission";

export interface INotificationsPermissionContainerProps {}

const NotificationsPermissionContainer: React.FC<INotificationsPermissionContainerProps> =
    (props) => {
        const dispatch = useDispatch();
        const user = useSelector(SessionSelectors.getUser);
        const hasUserSeenNotificationsPermissionDialog =
            UserSessionStorageFuncs.getItem(
                sessionVariables.hasUserSeenNotificationsPermissionDialog,
                "local",
                "boolean"
            );

        const [showDialog, setShowDialog] = React.useState(
            user &&
                Notification.permission === "default" &&
                !hasUserSeenNotificationsPermissionDialog
        );

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
                        deleteOpOnComplete: true,
                    })
                );
            }
        }, [hasUserSeenNotificationsPermissionDialog, dispatch]);

        const onClose = () => setShowDialog(false);

        const onRequestPermission = async () => {
            if (Notification.permission === "default") {
                try {
                    onClose();
                    await Notification.requestPermission();
                    const subscription = await registerPushNotification();

                    if (subscription) {
                        message.success("Push notification setup successfully");
                    }
                } catch (error) {
                    devError(error);
                    message.error("Error setting up push notifications");
                }
            }
        };

        if (user && showDialog) {
            return (
                <NotificationsPermission
                    user={user}
                    onClose={onClose}
                    onRequestPermission={onRequestPermission}
                />
            );
        }

        return null;
    };

export default NotificationsPermissionContainer;
