import React from "react";
import StyledContainer from "../styled/Container";
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
    <StyledContainer s={{ flexDirection: "column", width: "100%" }}>
      <StyledContainer s={{ flex: 1, overflow: "hidden" }}>
        <CommentList comments={comments} usersMap={usersMap} />
      </StyledContainer>
      <CommentInput onSendComment={onAddComment} />
    </StyledContainer>
  );
};

export default React.memo(TaskComments);
