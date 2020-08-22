import styled from "@emotion/styled";
import { Typography } from "antd";
import React from "react";
import { INotification } from "../../models/notification/notification";
import NotificationListItem from "./NotificationListItem";

export interface INotificationListProps {
  notifications: INotification[];
  onClickNotification: (notification: INotification) => void;
  currentNotificationId?: string;
  style?: React.CSSProperties;
}

class NotificationList extends React.Component<INotificationListProps> {
  public findNotification(id: string) {
    return this.props.notifications.find(
      (nextNotification) => nextNotification.customId === id
    )!;
  }

  public onClickNotication = (id) => {
    const { currentNotificationId } = this.props;

    if (currentNotificationId !== id) {
      this.setState({ currentNotification: id });
      this.props.onClickNotification(this.findNotification(id));
    }
  };

  public render() {
    const { notifications, currentNotificationId, style } = this.props;

    return (
      <StyledNotificationList style={style}>
        <Typography.Title
          level={4}
          style={{ margin: "0 16px", marginTop: "16px" }}
        >
          Notifications
        </Typography.Title>
        <StyledList>
          {notifications.map((notification) => {
            return (
              <NotificationListItem
                key={notification.customId}
                notification={notification}
                onClick={() => this.onClickNotication(notification.customId)}
                isSelected={
                  currentNotificationId === notification.customId ? true : false
                }
              />
            );
          })}
        </StyledList>
      </StyledNotificationList>
    );
  }
}

export default NotificationList;

const StyledNotificationList = styled.div({
  height: "100%",
  display: "flex",
  flexDirection: "column",
});

const StyledList = styled.div({
  overflow: "auto",
});
