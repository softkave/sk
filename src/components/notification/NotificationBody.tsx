import styled from "@emotion/styled";
import React from "react";
import { INotification } from "../../models/notification/notification";
import NotificationResponseContainer from "./NotificationResponseContainer";

export interface INotificationBodyProps {
  notification: INotification;
}

class NotificationBody extends React.Component<INotificationBodyProps> {
  public render() {
    const { notification } = this.props;

    return (
      <StyledNotificationBody>
        <StyledNotificationBodyHead>
          <h4>Collaboration Request From {notification.from.blockName}</h4>
          <span>{new Date(notification.createdAt).toDateString()}</span>
        </StyledNotificationBodyHead>
        <p>{notification.body}</p>
        <NotificationResponseContainer id={notification.customId} />
      </StyledNotificationBody>
    );
  }
}

export default NotificationBody;

const StyledNotificationBody = styled.div({
  padding: "1em",
  backgroundColor: "white",
  height: "100%"
});

const StyledNotificationBodyHead = styled.div({
  marginBottom: "1em"
});
