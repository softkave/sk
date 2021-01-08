import { createAsyncThunk } from "@reduxjs/toolkit";
import { IComment } from "../../../models/comment/types";
import BlockAPI from "../../../net/block/block";
import { getNewId } from "../../../utils/utils";
import CommentActions from "../../comments/actions";
import SessionSelectors from "../../session/selectors";
import { IAppAsyncThunkConfig } from "../../types";
import {
    dispatchOperationCompleted,
    dispatchOperationError,
    dispatchOperationStarted,
    IOperation,
    isOperationStarted,
    wrapUpOpAction,
} from "../operation";
import OperationType from "../OperationType";
import OperationSelectors from "../selectors";
import { GetOperationActionArgs } from "../types";

export interface ILoadTaskCommentsOpActionArgs {
    taskId: string;
}

export const loadTaskCommentsOpAction = createAsyncThunk<
    IOperation | undefined,
    GetOperationActionArgs<ILoadTaskCommentsOpActionArgs>,
    IAppAsyncThunkConfig
>("op/block/loadTaskComments", async (arg, thunkAPI) => {
    const opId = arg.opId || getNewId();

    const operation = OperationSelectors.getOperationWithId(
        thunkAPI.getState(),
        opId
    );

    if (isOperationStarted(operation)) {
        return;
    }

    thunkAPI.dispatch(
        dispatchOperationStarted(
            opId,
            OperationType.LoadTaskComments,
            arg.taskId
        )
    );

    try {
        const isDemoMode = SessionSelectors.isDemoMode(thunkAPI.getState());
        let comments: IComment[] = [];

        if (!isDemoMode) {
            const result = await BlockAPI.getTaskComments({
                taskId: arg.taskId,
            });

            if (result && result.errors) {
                throw result.errors;
            }

            comments = result.comments || [];
        }

        const boards: string[] = [];

        thunkAPI.dispatch(
            CommentActions.bulkAdd(
                comments.map((comment) => ({
                    id: comment.customId,
                    data: comment,
                }))
            )
        );

        thunkAPI.dispatch(
            dispatchOperationCompleted(
                opId,
                OperationType.LoadTaskComments,
                arg.taskId
            )
        );
    } catch (error) {
        thunkAPI.dispatch(
            dispatchOperationError(
                opId,
                OperationType.LoadTaskComments,
                error,
                arg.taskId
            )
        );
    }

    return wrapUpOpAction(thunkAPI, opId, arg);
});
