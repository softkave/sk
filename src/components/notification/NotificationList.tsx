import { Col, Row } from "antd";
import React from "react";

import throttle from "lodash/throttle";
import { getWindowWidth } from "../../utils/window";
import NotificationBody from "./NotificationBody.jsx";

import {
  OnClickNotification,
  OnRespondToNotification
} from "../../app/notification";
import { INotification } from "../../models/notification/notification";
import "./notification-list.css";

export interface INotificationListItemProps {
  // TODO: Define type
  notification: INotification;
  isSelected: boolean;
  onClick: () => void;
}

const NotificationListItem: React.SFC<INotificationListItemProps> = props => {
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
    : {};

  return (
    <div onClick={onClick} className="notifications-list-item" style={style}>
      <h5>Collaboration Request From {notification.from.blockName}</h5>
      <span>{new Date(notification.createdAt).toDateString()}</span>
    </div>
  );
};

export interface INotificationListProps {
  // TODO: Define type
  notifications: { [key: string]: any };
  onClickNotification: OnClickNotification;
  onRespond: OnRespondToNotification;
}

interface INotificationListState {
  renderType: string;
  currentNotification?: string;
}

class NotificationList extends React.Component<
  INotificationListProps,
  INotificationListState
> {
  constructor(props) {
    super(props);
    this.state = {
      renderType: this.getRenderType(),
      currentNotification: undefined
    };

    this.setRenderType = throttle(this.setRenderType, 100, { leading: true });
  }

  public componentDidMount() {
    window.addEventListener("resize", this.setRenderType);
  }

  public componentWillUnmount() {
    window.removeEventListener("resize", this.setRenderType);
  }

  public onClickNotication = id => {
    if (this.state.currentNotification !== id) {
      this.setState({ currentNotification: id });
      this.props.onClickNotification({
        notification: this.props.notifications[id]
      });
    }
  };

  public setRenderType() {
    const renderType = this.getRenderType();
    if (this.state.renderType !== renderType) {
      this.setState({ renderType });
    }
  }

  public getRenderType() {
    return getWindowWidth() > 500 ? "desktop" : "mobile";
  }

  public renderCurrentNotification() {
    const { notifications, onRespond } = this.props;
    const { currentNotification } = this.state;

    return (
      <NotificationBody
        notification={notifications[currentNotification!]}
        onRespond={onRespond}
      />
    );
  }

  public renderNotifications() {
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

  public render() {
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
