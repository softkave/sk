import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateClientOpAction } from "../../redux/operations/session/updateClient";
import SessionSelectors from "../../redux/session/selectors";
import UserSessionStorageFuncs, {
    sessionVariables,
} from "../../storage/userSession";
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
                await Notification.requestPermission();
                onClose();
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
