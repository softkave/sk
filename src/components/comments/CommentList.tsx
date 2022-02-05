import { css } from "@emotion/css";
import React from "react";
import { ICollaborator } from "../../models/collaborator/types";
import { IComment } from "../../models/comment/types";
import Message from "../Message";
import Comment from "./Comment";

export interface ICommentListProps {
  comments: IComment[];
  usersMap: { [key: string]: ICollaborator };
}

const CommentList: React.FC<ICommentListProps> = (props) => {
  const { comments, usersMap } = props;

  if (comments.length === 0) {
    return (
      <div
        className={css({
          margin: "24px 0",
          width: "100%",
        })}
      >
        <Message message="Comments" />
      </div>
    );
  }

  let hideAvatarCheck: { [key: string]: boolean } = {};

  return (
    <div>
      {comments.map((comment, i) => {
        const sender = usersMap[comment.createdBy];
        const commentNode = (
          <Comment
            key={i}
            comment={comment}
            sender={sender}
            hideAvatar={hideAvatarCheck[comment.createdBy]}
            className={css({
              margin: "16px 0px",
              marginTop: i === 0 ? "0px" : "16px",
            })}
          />
        );

        hideAvatarCheck = { [comment.createdBy]: true };
        return commentNode;
      })}
    </div>
  );
};

export default CommentList;
