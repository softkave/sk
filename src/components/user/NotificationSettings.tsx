import { css } from "@emotion/css";
import { Button, Typography } from "antd";
import React from "react";
import { IClient } from "../../models/user/user";
import { supportsServiceWorkers } from "../../serviceWorkerRegistration";
import UpdateClientFormContainer from "./UpdateClientFormContainer";

export interface INotificationSettingsProps {
    client: IClient;
    onRequestPermission: () => void;
}

const classes = {
    root: css({ padding: "16px" }),
    actionBtn: css({ marginTop: "32px" }),
};

const NotificationSettings: React.FC<INotificationSettingsProps> = (props) => {
    const { client, onRequestPermission } = props;

    if (!supportsServiceWorkers()) {
        return (
            <div className={classes.root}>
                <Typography.Paragraph>
                    Your browser does not support service workers, a necessary
                    feature we use to implement notifications. Try updating your
                    browser.
                </Typography.Paragraph>
            </div>
        );
    }

    const permission = {
        isGranted: Notification.permission === "granted",
        isDenied: Notification.permission === "denied",
        isDefault: Notification.permission === "default",
    };

    if (permission.isDenied || permission.isDefault) {
        return (
            <div className={classes.root}>
                <Typography.Paragraph>
                    You currently don't have notifications turned on, so we
                    won't be able to notify through this browser when you get
                    messages and you're not currently logged in or not viewing
                    the app. To change this, click the "Request Permission"
                    button below.
                </Typography.Paragraph>
                <Button
                    type="primary"
                    onClick={onRequestPermission}
                    className={classes.actionBtn}
                >
                    Request Permission
                </Button>
            </div>
        );
    }

    if (permission.isGranted) {
        if (client.isSubcribedToPushNotifications) {
            return (
                <div className={classes.root}>
                    <UpdateClientFormContainer />
                </div>
            );
        } else {
            return (
                <div className={classes.root}>
                    <Typography.Paragraph>
                        We weren't able to complete your notifications
                        registrations process. Don't worry though, we will
                        continue to retry the operation automatically. If after
                        a span of 4-5 logins/days ( that is, if after 4-5 days
                        or 4-5 times you've left the app and came back ), it's
                        not working, please send us a feedback using the
                        feedback form nicely tucked away in the menu where you
                        logout from the app
                    </Typography.Paragraph>
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
