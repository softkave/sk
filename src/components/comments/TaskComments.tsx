import React from "react";

import CommentInput from "./CommentInput";
import CommentList from "./CommentList";
import { IComment } from "../../models/comment/types";
import { ICollaborator } from "../../models/collaborator/types";

export interface ITaskCommentsProps {
  comments: IComment[];
  usersMap: { [key: string]: ICollaborator };
  onAddComment: (comment: string) => void;
}

const TaskComments: React.FC<ITaskCommentsProps> = (props) => {
  const { usersMap, comments, onAddComment } = props;

  return (
    <div style={{ flexDirection: "column", width: "100%" }}>
      <div style={{ flex: 1, overflow: "hidden" }}>
        <CommentList comments={comments} usersMap={usersMap} />
      </div>
      <CommentInput onSendComment={onAddComment} />
    </div>
  );
};

export default React.memo(TaskComments);
