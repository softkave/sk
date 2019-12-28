import styled from "@emotion/styled";
import { Button } from "antd";
import React from "react";
import {
  notificationStatus,
  NotificationStatusText
} from "../../models/notification/notification";

export interface INotificationResponseFormProps {
  onRespond: (response: NotificationStatusText) => void;
}

const NotificationResponseForm: React.FC<INotificationResponseFormProps> = props => {
  const { onRespond } = props;
  return (
    <div>
      <StyledResponseButton
        type="primary"
        onClick={() => onRespond(notificationStatus.accepted)}
      >
        Accept
      </StyledResponseButton>
      <StyledResponseButton
        type="danger"
        onClick={() => onRespond(notificationStatus.declined)}
      >
        Decline
      </StyledResponseButton>
    </div>
  );
};

export default NotificationResponseForm;

const StyledResponseButton = styled(Button)({
  marginLeft: "1em",

  "&:first-of-type": {
    marginLeft: 0
  }
});
