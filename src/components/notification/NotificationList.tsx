import { Col, Row } from "antd";
import throttle from "lodash/throttle";
import React from "react";

import {
  OnClickNotification,
  OnRespondToNotification
} from "../../app/notification";
import { INotification } from "../../models/notification/notification";
import { IUser } from "../../models/user/user";
import { getWindowWidth } from "../../utils/window";
import NotificationBody from "./NotificationBody";

import "./notification-list.css";

export interface INotificationListItemProps {
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
    : Number(notification.readAt) > 0
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
  notifications: INotification[];
  onClickNotification: OnClickNotification;
  onRespond: OnRespondToNotification;
  user: IUser;
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

  public findNotification(id: string) {
    return this.props.notifications.find(
      nextNotification => nextNotification.customId === id
    )!;
  }

  public onClickNotication = id => {
    if (this.state.currentNotification !== id) {
      this.setState({ currentNotification: id });
      this.props.onClickNotification({
        notification: this.findNotification(id)
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
    const { onRespond, user } = this.props;
    const { currentNotification } = this.state;

    return (
      <NotificationBody
        notification={this.findNotification(currentNotification!)}
        onRespond={onRespond}
        user={user}
      />
    );
  }

  public renderNotifications() {
    const { notifications } = this.props;
    const { currentNotification } = this.state;

    return (
      <div className="notifications-list-list">
        {notifications.map(notification => {
          return (
            <NotificationListItem
              key={notification.customId}
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
