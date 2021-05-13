import React from "react";
import { Button, Modal, Typography } from "antd";
import { IUser } from "../../models/user/user";
import { css } from "@emotion/css";

export interface INotificationsPermissionProps {
    user: IUser;
    onClose: () => void;
    onRequestPermission: () => void;
}

const NotificationsPermission: React.FC<INotificationsPermissionProps> = (
    props
) => {
    const { user, onClose, onRequestPermission } = props;

    return (
        <Modal visible footer={null} closable={false} title={null}>
            <Typography.Paragraph className={css({ textAlign: "center" })}>
                Hi <em>{user.name}</em>, we recently made changes to the app, to
                notify you when you have new messages and you are not logged in
                or not currently viewing our app, but we would need your
                permission to show notifications through your browser.
            </Typography.Paragraph>
            <div
                className={css({
                    padding: "16px",
                })}
            >
                <Button
                    danger
                    type="primary"
                    onClick={onClose}
                    className={css({
                        display: "inline-block",
                        marginRight: "16px",
                    })}
                >
                    Close
                </Button>
                <Button type="primary" onClick={onRequestPermission}>
                    Request Permission
                </Button>
            </div>
        </Modal>
    );
};

export default NotificationsPermission;
