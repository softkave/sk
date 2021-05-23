import { message } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import SessionSelectors from "../../redux/session/selectors";
import { registerPushNotification } from "../../serviceWorkerRegistration";
import { devError } from "../../utils/log";
import NotificationSettings from "./NotificationSettings";

export interface INotificationSettingsContainerProps {}

const NotificationSettingsContainer: React.FC<INotificationSettingsContainerProps> =
    (props) => {
        const client = useSelector(SessionSelectors.assertGetClient);
        const [requestingPermission, setRequestingPermission] =
            React.useState(false);

        const onRequestPermission = async () => {
            try {
                setRequestingPermission(true);
                await Notification.requestPermission();
                const subscription = await registerPushNotification();

                if (subscription) {
                    message.success("Push notification setup successfully");
                }
            } catch (error) {
                devError(error);
                message.error("Error setting up push notifications");
            }

            setRequestingPermission(false);
        };

        return (
            <NotificationSettings
                client={client}
                onRequestPermission={onRequestPermission}
                disableRequestPermission={requestingPermission}
            />
        );
    };

export default NotificationSettingsContainer;
