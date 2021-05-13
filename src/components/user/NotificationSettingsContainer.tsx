import React from "react";
import { useSelector } from "react-redux";
import SessionSelectors from "../../redux/session/selectors";
import NotificationSettings from "./NotificationSettings";

export interface INotificationSettingsContainerProps {}

const NotificationSettingsContainer: React.FC<INotificationSettingsContainerProps> =
    (props) => {
        const client = useSelector(SessionSelectors.assertGetClient);

        const onRequestPermission = async () => {
            if (Notification.permission === "default") {
                await Notification.requestPermission();
            }
        };

        return (
            <NotificationSettings
                client={client}
                onRequestPermission={onRequestPermission}
            />
        );
    };

export default NotificationSettingsContainer;
