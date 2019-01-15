import React from "react";
import { Button } from "antd";
import "./notification-body.css";

class NotificationBody extends React.Component {
  render() {
    const { notification, onRespond } = this.props;
    return (
      <div className="notification-body">
        <div className="notification-body-head">
          <h4>Collaboration Request From {notification.from.blockName}</h4>
          <span>{new Date(notification.createdAt).toDateString()}</span>
        </div>
        <p className="notification-body-body">{notification.body}</p>
        <div className="notification-body-btns">
          <Button
            type="primary"
            onClick={() => onRespond(notification, "Accepted")}
          >
            Accept
          </Button>
          <Button
            type="danger"
            onClick={() => onRespond(notification, "Declined")}
            style={{ margin: "0 1em" }}
          >
            Decline
          </Button>
        </div>
      </div>
    );
  }
}

export default NotificationBody;
