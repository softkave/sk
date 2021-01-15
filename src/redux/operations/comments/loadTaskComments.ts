import { createAsyncThunk } from "@reduxjs/toolkit";
import { IComment } from "../../../models/comment/types";
import CommentAPI, {
    IGetTaskCommentsAPIParams,
} from "../../../net/comments/comment";
import { getNewId } from "../../../utils/utils";
import BlockActions from "../../blocks/actions";
import BlockSelectors from "../../blocks/selectors";
import CommentActions from "../../comments/actions";
import SessionSelectors from "../../session/selectors";
import { IAppAsyncThunkConfig } from "../../types";
import { IOperation, isOperationStarted, OperationStatus } from "../operation";
import OperationType from "../OperationType";

// TODO: should we add the operation to the resource and keep it there
// so that we don't have to constantly look for it in the operations state

export const loadTaskCommentsOpAction = createAsyncThunk<
    IOperation | undefined,
    IGetTaskCommentsAPIParams,
    IAppAsyncThunkConfig
>("op/comment/loadTaskComments", async (arg, thunkAPI) => {
    const task = BlockSelectors.getBlock(thunkAPI.getState(), arg.taskId);
    let operation = task.taskCommentOp;

    if (isOperationStarted(operation)) {
        return;
    }

    operation = {
        id: getNewId(),
        operationType: OperationType.LoadTaskComments,
        status: {
            status: OperationStatus.Pending,
            timestamp: Date.now(),
        },
        resourceId: task.customId,
    };

    thunkAPI.dispatch(
        BlockActions.updateBlock({
            id: task.customId,
            data: {
                taskCommentOp: operation,
            },
        })
    );

    try {
        const isDemoMode = SessionSelectors.isDemoMode(thunkAPI.getState());
        let comments: IComment[] = [];

        if (!isDemoMode) {
            const result = await CommentAPI.getTaskComments({
                taskId: arg.taskId,
            });

            if (result && result.errors) {
                throw result.errors;
            }

            comments = result.comments;
        }

        thunkAPI.dispatch(
            CommentActions.bulkAdd(
                comments.map((c) => ({
                    id: c.customId,
                    data: c,
                }))
            )
        );

        operation = {
            id: getNewId(),
            operationType: OperationType.LoadTaskComments,
            status: {
                status: OperationStatus.Completed,
                timestamp: Date.now(),
            },
            resourceId: task.customId,
        };

        thunkAPI.dispatch(
            BlockActions.updateBlock({
                id: task.customId,
                data: {
                    taskCommentOp: operation,
                },
            })
        );
    } catch (error) {
        operation = {
            id: getNewId(),
            operationType: OperationType.LoadTaskComments,
            status: {
                status: OperationStatus.Error,
                timestamp: Date.now(),
                error: "Error loading comments",
            },
            resourceId: task.customId,
        };

        thunkAPI.dispatch(
            BlockActions.updateBlock({
                id: task.customId,
                data: {
                    taskCommentOp: operation,
                },
            })
        );
    }

    return operation;
});
