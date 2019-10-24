import styled from "@emotion/styled";
import React from "react";
import { NotificationStatusText } from "../../models/notification/notification";

export interface INotificationResponseProps {
  response: NotificationStatusText;
}

const NotificationResponse: React.SFC<INotificationResponseProps> = props => {
  const { response } = props;
  return (
    <p>
      You - <StyledNotificationResponse>{response}</StyledNotificationResponse>.
    </p>
  );
};

export default NotificationResponse;

const StyledNotificationResponse = styled.div({
  backgroundColor: "#ccc",
  padding: "8px",
  borderRadius: "4px"
});
