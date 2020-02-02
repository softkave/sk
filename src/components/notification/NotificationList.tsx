import styled from "@emotion/styled";
import React from "react";
import { INotification } from "../../models/notification/notification";
import NotificationListItem from "./NotificationListItem";

export interface INotificationListProps {
  notifications: INotification[];
  onClickNotification: (notification: INotification) => void;
  currentNotificationID?: string;
}

class NotificationList extends React.Component<INotificationListProps> {
  public findNotification(id: string) {
    return this.props.notifications.find(
      nextNotification => nextNotification.customId === id
    )!;
  }

  public onClickNotication = id => {
    const { currentNotificationID } = this.props;

    if (currentNotificationID !== id) {
      this.setState({ currentNotification: id });
      this.props.onClickNotification(this.findNotification(id));
    }
  };

  public render() {
    const { notifications, currentNotificationID } = this.props;

    return (
      <StyledNotificationList>
        <StyledHeader>Notifications</StyledHeader>
        <StyledList>
          {notifications.map(notification => {
            return (
              <NotificationListItem
                key={notification.customId}
                notification={notification}
                onClick={() => this.onClickNotication(notification.customId)}
                isSelected={
                  currentNotificationID === notification.customId ? true : false
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
  flexDirection: "column"
});

const StyledHeader = styled.h1({
  padding: "0 16px",
  marginBottom: 0
});

const StyledList = styled.div({
  overflow: "auto"
});
