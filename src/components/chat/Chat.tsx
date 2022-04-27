import { css } from "@emotion/css";
import { Typography } from "antd";
import moment from "moment";
import React from "react";
import { IChat } from "../../models/chat/types";
import { ICollaborator } from "../../models/collaborator/types";
import UserAvatar from "../collaborator/UserAvatar";

export interface IChatProps {
  chat: IChat;
  sender: ICollaborator;
  hideAvatar?: boolean;
  isUserSender?: boolean;
}

const Chat: React.FC<IChatProps> = (props) => {
  const { chat, sender, hideAvatar, isUserSender } = props;
  const createdAt = moment(chat.createdAt);
  const textClassName = css({
    textAlign: isUserSender ? "right" : undefined,
  });

  return (
    <div
      style={{
        flex: 1,
        // justifyContent: isUserSender ? "flex-end" : undefined,
        flexDirection: isUserSender ? "row-reverse" : undefined,
      }}
    >
      <div
        style={{
          width: 24,
        }}
      >
        {!hideAvatar && <UserAvatar user={sender} />}
      </div>
      <div
        style={{
          flex: 1,
          maxWidth: "500px",
          flexDirection: "column",
          marginLeft: isUserSender ? undefined : "16px",
          marginRight: isUserSender ? "16px" : undefined,
        }}
      >
        <Typography.Paragraph className={textClassName} style={{ margin: 0 }}>
          {chat.message}
        </Typography.Paragraph>
        {chat.queued ? (
          <Typography.Text type="secondary" className={textClassName}>
            Queued for sending
          </Typography.Text>
        ) : chat.sending ? (
          <Typography.Text type="secondary" className={textClassName}>
            Sending...
          </Typography.Text>
        ) : chat.errorMessage ? (
          <Typography.Text type="danger" className={textClassName}>
            {chat.errorMessage}
          </Typography.Text>
        ) : (
          <Typography.Text type="secondary" className={textClassName}>
            {/* {createdAt.fromNow()}{" "} */}
            {createdAt.format("h:mm A, ddd MMM D YYYY")}
          </Typography.Text>
        )}
      </div>
    </div>
  );
};

export default React.memo(Chat);
