import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { ICollaborator } from "../../models/collaborator/types";
import { IComment } from "../../models/comment/types";
import { IAppOrganization } from "../../models/organization/types";
import { ITask } from "../../models/task/types";
import CommentSelectors from "../../redux/comments/selectors";
import { addCommentOpAction } from "../../redux/operations/comment/addComment";
import { loadTaskCommentsOpAction } from "../../redux/operations/comment/loadTaskComments";
import OrganizationSelectors from "../../redux/organizations/selectors";
import TaskSelectors from "../../redux/tasks/selectors";
import { IAppState } from "../../redux/types";
import UserSelectors from "../../redux/users/selectors";
import { getOpData } from "../hooks/useOperation";
import MessageList from "../MessageList";
import LoadingEllipsis from "../utilities/LoadingEllipsis";
import TaskComments from "./TaskComments";

export interface ICommentsContainerProps {
  taskId: string;
}

const CommentsContainer: React.FC<ICommentsContainerProps> = (props) => {
  const { taskId } = props;
  const dispatch = useDispatch();

  const task = useSelector<IAppState, ITask>((state) =>
    TaskSelectors.assertGetOne(state, taskId)
  );

  const op = task.taskCommentOp;
  const opData = op && getOpData(op);

  React.useEffect(() => {
    if (!op) {
      dispatch(
        loadTaskCommentsOpAction({
          taskId: task.customId,
        })
      );
    }
  }, [op, dispatch, task.customId]);

  const org = useSelector<IAppState, IAppOrganization>((state) =>
    OrganizationSelectors.assertGetOne(state, task.rootBlockId)
  );

  const collaborators = useSelector<IAppState, ICollaborator[]>((state) => {
    if (opData && opData.isCompleted) {
      return UserSelectors.getMany(state, org.collaboratorIds!);
    }

    return [];
  });

  const usersMap = collaborators.reduce((map, collaborator) => {
    map[collaborator.customId] = collaborator;
    return map;
  }, {} as { [key: string]: ICollaborator });

  const comments = useSelector<IAppState, IComment[]>((state) => {
    if (opData && opData.isCompleted) {
      return CommentSelectors.filter(
        state,
        (comment) => comment.taskId === task.customId
      ).sort((c1, c2) => {
        // TODO: how can we presort
        return (
          new Date(c1.createdAt).valueOf() - new Date(c2.createdAt).valueOf()
        );
      });
    }

    return [];
  });

  const onAddComment = React.useCallback(
    async (comment: string) => {
      dispatch(
        addCommentOpAction({
          comment,
          taskId: task.customId,
        })
      );
    },
    [dispatch]
  );

  if (opData && opData.isLoading) {
    return <LoadingEllipsis />;
  } else if (opData && opData.error) {
    return <MessageList fill messages={opData.error} />;
  }

  return (
    <TaskComments
      comments={comments}
      usersMap={usersMap}
      onAddComment={onAddComment}
    />
  );
};

export default CommentsContainer;
