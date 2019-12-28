import styled from "@emotion/styled";
import { Typography } from "antd";
import React from "react";
import { INotification } from "../../models/notification/notification";

export interface INotificationListItemProps {
  notification: INotification;
  isSelected: boolean;
  onClick: () => void;
}

const NotificationListItem: React.FC<INotificationListItemProps> = props => {
  const { notification, isSelected, onClick } = props;
  return (
    <StyledNotificationListItem
      onClick={onClick}
      isSelected={isSelected}
      isRead={!!notification.readAt}
    >
      <Typography.Text strong>
        Collaboration Request From {notification.from.blockName}
      </Typography.Text>
      <Typography.Text>
        {new Date(notification.createdAt).toDateString()}
      </Typography.Text>
    </StyledNotificationListItem>
  );
};

export default NotificationListItem;

interface IStyledNotificationListItemProps {
  isSelected: boolean;
  isRead: boolean;
}

const seenNotificationColor = "#777";

const StyledNotificationListItem = styled("div")<
  IStyledNotificationListItemProps
>(props => ({
  padding: "16px 24px",
  cursor: "pointer",
  color: props.isSelected
    ? "white"
    : props.isRead
    ? seenNotificationColor
    : "black",
  backgroundColor: props.isSelected ? "#e6f7ff" : "inherit",
  display: "flex",
  flexDirection: "column"

  // [childrenSelector]: {
  //   color: props.isSelected
  //     ? "white"
  //     : props.isRead
  //     ? seenNotificationColor
  //     : "black"
  // }
}));
