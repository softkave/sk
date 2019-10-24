import styled from "@emotion/styled";
import React from "react";
import { INotification } from "../../models/notification/notification";

export interface INotificationListItemProps {
  notification: INotification;
  isSelected: boolean;
  onClick: () => void;
}

const NotificationListItem: React.SFC<INotificationListItemProps> = props => {
  const { notification, isSelected, onClick } = props;
  return (
    <StyledNotificationListItem
      onClick={onClick}
      isSelected={isSelected}
      isRead={!!notification.readAt}
    >
      <h5>Collaboration Request From {notification.from.blockName}</h5>
      <span>{new Date(notification.createdAt).toDateString()}</span>
    </StyledNotificationListItem>
  );
};

export default NotificationListItem;

interface IStyledNotificationListItemProps {
  isSelected: boolean;
  isRead: boolean;
}

const StyledNotificationListItem = (styled("div")(
  (props: IStyledNotificationListItemProps & any) => ({
    padding: "1em",
    cursor: "pointer",
    color: props.isSelected ? "white" : props.isRead ? "grey" : "black",
    backgroundColor: props.isSelected ? "rgb(66,133,244)" : "inherit"
  })
) as unknown) as React.SFC<
  IStyledNotificationListItemProps & React.HTMLAttributes<HTMLDivElement>
>;
