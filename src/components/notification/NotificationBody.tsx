import { Button } from "antd";
import React from "react";

import { OnRespondToNotification } from "../../app/notification";

import { IUser } from "../../models/user/user";
import "./notification-body.css";

const accepted = "accepted";
const declined = "declined";

export interface INotificationBodyProps {
  notification: any;
  onRespond: OnRespondToNotification;
  user: IUser;
}

class NotificationBody extends React.Component<INotificationBodyProps> {
  public render() {
    const { notification, onRespond, user } = this.props;
    const response = this.getUserResponse(notification);

    return (
      <div className="notification-body">
        <div className="notification-body-head">
          <h4>Collaboration Request From {notification.from.blockName}</h4>
          <span>{new Date(notification.createdAt).toDateString()}</span>
        </div>
        <p className="notification-body-body">{notification.body}</p>
        <div className="notification-body-btns">
          {!response ? (
            <>
              <Button
                type="primary"
                onClick={() =>
                  onRespond({ notification, user, response: accepted })
                }
              >
                Accept
              </Button>
              <Button
                type="danger"
                onClick={() =>
                  onRespond({ notification, user, response: declined })
                }
                style={{ margin: "0 1em" }}
              >
                Decline
              </Button>
            </>
          ) : (
            <p>
              You -{" "}
              <span
                style={{
                  backgroundColor: "#ccc",
                  padding: "8px",
                  borderRadius: "4px"
                }}
              >
                {response.status}
              </span>
            </p>
          )}
        </div>
      </div>
    );
  }

  private getUserResponse(notification) {
    if (Array.isArray(notification.statusHistory)) {
      const possibleUserResponses = {
        [accepted]: true,
        [declined]: true
      };

      return notification.statusHistory.find(({ status }) => {
        return possibleUserResponses[status];
      });
    }

    return null;
  }
}

export default NotificationBody;
