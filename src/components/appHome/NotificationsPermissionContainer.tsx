import React from "react";
import { useSelector } from "react-redux";
import SessionSelectors from "../../redux/session/selectors";
import UserSessionStorageFuncs, {
    sessionVariables,
} from "../../storage/userSession";
import NotificationsPermission from "./NotificationsPermission";

export interface INotificationsPermissionContainerProps {}

const NotificationsPermissionContainer: React.FC<INotificationsPermissionContainerProps> = (
    props
) => {
    const user = useSelector(SessionSelectors.getUser);
    const hasUserSeenNotificationsPermissionDialog = UserSessionStorageFuncs.getItem(
        sessionVariables.hasUserSeenNotificationsPermissionDialog
    );

    const [showDialog, setShowDialog] = React.useState(
        user &&
            Notification.permission === "default" &&
            !hasUserSeenNotificationsPermissionDialog
    );

    React.useEffect(() => {
        if (!hasUserSeenNotificationsPermissionDialog) {
            UserSessionStorageFuncs.setItem(
                sessionVariables.hasUserSeenNotificationsPermissionDialog,
                true
            );
        }
    }, [hasUserSeenNotificationsPermissionDialog]);

    const onClose = () => setShowDialog(false);

    const onRequestPermission = async () => {
        await Notification.requestPermission();
        onClose();
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
