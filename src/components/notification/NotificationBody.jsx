import React from "react";
import { Button } from "antd";
import "./notification-body.css";

const accepted = "accepted";
const declined = "declined";

class NotificationBody extends React.Component {
  getUserResponse(notification) {
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

  render() {
    const { notification, onRespond } = this.props;
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
                onClick={() => onRespond(notification, accepted)}
              >
                Accept
              </Button>
              <Button
                type="danger"
                onClick={() => onRespond(notification, accepted)}
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
}

export default NotificationBody;
