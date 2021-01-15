import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { IBlock } from "../../models/block/block";
import { IComment } from "../../models/comment/types";
import { IUser } from "../../models/user/user";
import BlockSelectors from "../../redux/blocks/selectors";
import CommentSelectors from "../../redux/comments/selectors";
import { addCommentOpAction } from "../../redux/operations/comments/addComment";
import { loadTaskCommentsOpAction } from "../../redux/operations/comments/loadTaskComments";
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

    const task = useSelector<IAppState, IBlock>((state) =>
        BlockSelectors.getBlock(state, taskId)
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
    }, [op]);

    const org = useSelector<IAppState, IBlock>((state) =>
        BlockSelectors.getBlock(state, task.rootBlockId!)
    );

    const collaborators = useSelector<IAppState, IUser[]>((state) => {
        if (opData && opData.isCompleted) {
            return UserSelectors.getUsers(state, org.collaborators!);
        }

        return [];
    });

    const usersMap = collaborators.reduce((map, collaborator) => {
        map[collaborator.customId] = collaborator;
        return map;
    }, {} as { [key: string]: IUser });

    const comments = useSelector<IAppState, IComment[]>((state) => {
        if (opData && opData.isCompleted) {
            return CommentSelectors.filter(
                state,
                (comment) => comment.taskId === task.customId
            ).sort((c1, c2) => {
                // TODO: how can we presort
                return (
                    new Date(c1.createdAt).valueOf() -
                    new Date(c2.createdAt).valueOf()
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
