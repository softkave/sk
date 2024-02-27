import { css } from "@emotion/css";
import { Button, Modal, Typography } from "antd";
import React from "react";
import { IUser } from "../../models/user/types";
import { getUserFullName } from "../../models/user/utils";

export interface INotificationsPermissionRequestProps {
  user: IUser;
  onClose: () => void;
  onRequestPermission: () => void;
}

type ComponentType = React.FC<INotificationsPermissionRequestProps>;

const NotificationsPermissionRequest: ComponentType = (props) => {
  const { user, onClose, onRequestPermission } = props;

  return (
    <Modal visible footer={null} closable={false} title={null}>
      <Typography.Paragraph className={css({ textAlign: "center" })}>
        Hi <Typography.Text strong>{getUserFullName(user)}</Typography.Text>, we recently made
        changes to the app to notify you when you have new messages and not currently viewing the
        app, but we would need your permission to show notifications through your browser.
      </Typography.Paragraph>
      <div
        className={css({
          paddingTop: "16px",
          display: "flex",
          width: "100%",
        })}
      >
        <Button
          danger
          onClick={onClose}
          className={css({
            display: "inline-block",
            marginRight: "16px",
          })}
        >
          Close
        </Button>
        <div
          className={css({
            display: "flex",
            flex: 1,
            justifyContent: "flex-end",
          })}
        >
          <Button type="primary" onClick={onRequestPermission}>
            Request Permission
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default NotificationsPermissionRequest;
