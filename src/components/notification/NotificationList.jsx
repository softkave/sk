import React from "react";
import { getWindowWidth } from "../../utils/window";
import throttle from "lodash/throttle";
import { Row, Col } from "antd";
import NotificationBody from "./NotificationBody.jsx";
import "./notification-list.css";

function NotificationListItem(props) {
  const { notification, isSelected, onClick } = props;
  const style = isSelected
    ? {
        backgroundColor: "rgb(66,133,244)",
        color: "white"
      }
    : notification.readAt > 0
    ? {
        color: "grey"
      }
    : null;

  return (
    <div onClick={onClick} className="notifications-list-item" style={style}>
      <h5>Collaboration Request From {notification.from.blockName}</h5>
      <span>{new Date(notification.createdAt).toDateString()}</span>
    </div>
  );
}

class NotificationList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      renderType: this.getRenderType(),
      currentNotification: null
    };

    this.setRenderType = throttle(this.setRenderType, 100, { leading: true });
  }

  componentDidMount() {
    window.addEventListener("resize", this.setRenderType);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.setRenderType);
  }

  onClickNotication = id => {
    if (this.state.currentNotification !== id) {
      this.setState({ currentNotification: id });
      this.props.onClickNotification(this.props.notifications[id]);
    }
  };

  setRenderType() {
    const renderType = this.getRenderType();
    if (this.state.renderType !== renderType) {
      this.setRenderType({ renderType });
    }
  }

  getRenderType() {
    return getWindowWidth() > 500 ? "desktop" : "mobile";
  }

  renderCurrentNotification() {
    const { notifications, onRespond } = this.props;
    const { currentNotification } = this.state;

    return (
      <NotificationBody
        notification={notifications[currentNotification]}
        onRespond={onRespond}
      />
    );
  }

  renderNotifications() {
    const { notifications } = this.props;
    const { currentNotification } = this.state;
    return (
      <div className="notifications-list-list">
        {Object.keys(notifications).map(notificationId => {
          const notification = notifications[notificationId];
          return (
            <NotificationListItem
              key={notificationId}
              notification={notification}
              onClick={() => this.onClickNotication(notification.customId)}
              isSelected={
                currentNotification === notification.customId ? true : false
              }
            />
          );
        })}
      </div>
    );
  }

  render() {
    const { renderType, currentNotification } = this.state;

    if (renderType === "mobile") {
      if (currentNotification) {
        return this.renderCurrentNotification();
      }

      return this.renderNotifications();
    }

    return (
      <Row style={{ height: "100%" }}>
        <Col style={{ height: "100%" }} span={8}>
          {this.renderNotifications()}
        </Col>
        <Col style={{ height: "100%" }} span={16}>
          {currentNotification ? this.renderCurrentNotification() : null}
        </Col>
      </Row>
    );
  }
}

export default NotificationList;
