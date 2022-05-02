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

const classes = {
  root: css({
    display: "flex",
    flex: 1,
  }),
  avatar: css({
    width: 24,
  }),
  main: css({
    display: "flex",
    flex: 1,
    maxWidth: "500px",
    flexDirection: "column",
  }),
};

const Chat: React.FC<IChatProps> = (props) => {
  const { chat, sender, hideAvatar, isUserSender } = props;
  const createdAt = moment(chat.createdAt);
  const textClassName = css({
    textAlign: isUserSender ? "right" : undefined,
  });

  return (
    <div
      className={classes.root}
      style={{ flexDirection: isUserSender ? "row-reverse" : undefined }}
    >
      <div className={classes.avatar}>
        {!hideAvatar && <UserAvatar user={sender} />}
      </div>
      <div
        className={classes.main}
        style={{
          marginLeft: isUserSender ? undefined : "16px",
          marginRight: isUserSender ? "16px" : undefined,
        }}
      >
        <Typography.Paragraph className={textClassName} style={{ margin: 0 }}>
          {chat.message}
        </Typography.Paragraph>
        {chat.sending ? (
          <Typography.Text type="secondary" className={textClassName}>
            Sending...
          </Typography.Text>
        ) : chat.errorMessage ? (
          <Typography.Text type="danger" className={textClassName}>
            {chat.errorMessage}
          </Typography.Text>
        ) : (
          <Typography.Text type="secondary" className={textClassName}>
            {createdAt.format("h:mm A, ddd MMM D YYYY")}
          </Typography.Text>
        )}
      </div>
    </div>
  );
};

export default React.memo(Chat);
