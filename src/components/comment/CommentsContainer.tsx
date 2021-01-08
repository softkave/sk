import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { IBlock } from "../../models/block/block";
import { IComment } from "../../models/comment/types";
import { IUser } from "../../models/user/user";
import BlockSelectors from "../../redux/blocks/selectors";
import CommentSelectors from "../../redux/comments/selectors";
import { loadTaskCommentsOpAction } from "../../redux/operations/block/loadTaskComments";
import OperationType from "../../redux/operations/OperationType";
import { IAppState } from "../../redux/types";
import UserSelectors from "../../redux/users/selectors";
import useOperation, { IOperationDerivedData } from "../hooks/useOperation";
import MessageList from "../MessageList";
import LoadingEllipsis from "../utilities/LoadingEllipsis";
import TaskComments from "./TaskComments";

export interface ICommentsContainerProps {
    task: IBlock;
}

const ChatRoomsContainer: React.FC<ICommentsContainerProps> = (props) => {
    const { task } = props;

    const dispatch = useDispatch();

    const loadComments = React.useCallback(
        async (loadProps: IOperationDerivedData) => {
            const operation = loadProps.operation;
            const shouldLoad = !operation;

            if (shouldLoad) {
                await dispatch(
                    loadTaskCommentsOpAction({
                        taskId: task.customId,
                        opId: loadProps.opId,
                    })
                );
            }
        },
        [dispatch]
    );

    // TODO: can we save whether the comments are loaded or not
    // in the task so that we don't keep more operations than needed
    // in state
    const commentsOp = useOperation(
        { type: OperationType.LoadTaskComments },
        loadComments,
        {
            deleteManagedOperationOnUnmount: false,
        }
    );

    const org = useSelector<IAppState, IBlock>((state) =>
        BlockSelectors.getBlock(state, task.rootBlockId!)
    );

    const collaborators = useSelector<IAppState, IUser[]>((state) => {
        if (commentsOp.isCompleted) {
            return UserSelectors.getUsers(state, org.collaborators!);
        }

        return [];
    });

    const usersMap = collaborators.reduce((map, collaborator) => {
        map[collaborator.customId] = collaborator;
        return map;
    }, {} as { [key: string]: IUser });

    const comments = useSelector<IAppState, IComment[]>((state) => {
        if (commentsOp.isCompleted) {
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

    const onSendComment = React.useCallback((comment: string) => {}, [
        dispatch,
    ]);

    if (commentsOp.isLoading) {
        return <LoadingEllipsis />;
    } else if (commentsOp.error) {
        return <MessageList fill messages={commentsOp.error} />;
    }

    return (
        <TaskComments
            comments={comments}
            usersMap={usersMap}
            onSendComment={onSendComment}
        />
    );
};

export default ChatRoomsContainer;
