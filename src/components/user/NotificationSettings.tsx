import { css } from "@emotion/css";
import { Button, Typography } from "antd";
import React from "react";
import { IClient } from "../../models/user/user";
import { supportsServiceWorkers } from "../../serviceWorkerRegistration";
import { supportsNotification } from "../../utils/supports";
import UpdateClientFormContainer from "./UpdateClientFormContainer";

export interface INotificationSettingsProps {
    client: IClient;
    onRequestPermission: () => void;
    disableRequestPermission?: boolean;
}

const classes = {
    root: css({ padding: "16px" }),
    actionBtn: css({ marginTop: "32px" }),
};

const NotificationSettings: React.FC<INotificationSettingsProps> = (props) => {
    const { client, disableRequestPermission, onRequestPermission } = props;

    if (!supportsServiceWorkers()) {
        return (
            <div className={classes.root}>
                <Typography.Paragraph>
                    Your browser does not support{" "}
                    <Typography.Text strong>Service Workers</Typography.Text>, a{" "}
                    feature we use to implement notifications. To fix this, try{" "}
                    updating your browser.
                </Typography.Paragraph>
            </div>
        );
    }

    if (!supportsNotification()) {
        return (
            <div className={classes.root}>
                <Typography.Paragraph>
                    Your browser does not support notifications. To fix this,{" "}
                    try updating your browser.
                </Typography.Paragraph>
            </div>
        );
    }

    const permission = {
        isGranted: window.Notification.permission === "granted",
        isDenied: window.Notification.permission === "denied",
        isDefault: window.Notification.permission === "default",
    };

    if (permission.isDenied || permission.isDefault) {
        return (
            <div className={classes.root}>
                <Typography.Paragraph>
                    You currently don't have notifications turned on, so we
                    won't be able to notify you through this browser when you
                    get messages and you're not currently on the app. To change
                    this, click the "Request Permission" button below.
                </Typography.Paragraph>
                <Button
                    type="primary"
                    onClick={onRequestPermission}
                    disabled={disableRequestPermission}
                >
                    Request Permission
                </Button>
            </div>
        );
    }

    if (permission.isGranted) {
        if (client.isSubcribedToPushNotifications) {
            return <UpdateClientFormContainer />;
        } else {
            return (
                <div className={classes.root}>
                    <Typography.Paragraph>
                        So, you've granted us permission to show notifications,
                        but we weren't able complete the process. You can retry
                        the process by clicking the button below.
                    </Typography.Paragraph>
                    <Button
                        type="primary"
                        onClick={onRequestPermission}
                        disabled={disableRequestPermission}
                    >
                        Retry Setting up Notifications
                    </Button>
                </div>
            );
        }
    }

    return (
        <div className={classes.root}>
            <Typography.Paragraph>
                If you're seeing this page, then there's a bug in our code.
                Please report this to us using the Feedbacks form nicely tucked
                away around where you logout from the app.
            </Typography.Paragraph>
        </div>
    );
};

export default NotificationSettings;
