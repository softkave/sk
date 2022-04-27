import { css, cx } from "@emotion/css";
import { Typography } from "antd";
import moment from "moment";
import React from "react";
import { ICollaborator } from "../../models/collaborator/types";
import { IComment } from "../../models/comment/types";
import UserAvatar from "../collaborator/UserAvatar";

export interface ICommentProps {
  comment: IComment;
  sender: ICollaborator;
  hideAvatar?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

const Comment: React.FC<ICommentProps> = (props) => {
  const { comment, sender, hideAvatar, style, className } = props;
  const createdAt = moment(comment.createdAt);

  return (
    <div
      style={style}
      className={cx(className, css({ display: "flex", flex: 1 }))}
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
          marginLeft: "16px",
        }}
      >
        <Typography.Paragraph style={{ margin: 0 }}>
          {comment.comment}
        </Typography.Paragraph>
        {comment.queued ? (
          <Typography.Text type="secondary">Queued for sending</Typography.Text>
        ) : comment.sending ? (
          <Typography.Text type="secondary">Sending...</Typography.Text>
        ) : comment.errorMessage ? (
          <Typography.Text type="danger">
            {comment.errorMessage}
          </Typography.Text>
        ) : (
          <Typography.Text type="secondary">
            {createdAt.format("h:mm A, ddd MMM D YYYY")}
          </Typography.Text>
        )}
      </div>
    </div>
  );
};

export default React.memo(Comment);
