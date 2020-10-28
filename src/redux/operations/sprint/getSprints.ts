import { createAsyncThunk } from "@reduxjs/toolkit";
import SprintAPI from "../../../net/sprint/sprint";
import { getNewId } from "../../../utils/utils";
import SprintActions from "../../sprints/actions";
import { IAppAsyncThunkConfig } from "../../types";
import {
    dispatchOperationCompleted,
    dispatchOperationError,
    dispatchOperationStarted,
    IOperation,
    isOperationStarted,
} from "../operation";
import OperationType from "../OperationType";
import OperationSelectors from "../selectors";
import { GetOperationActionArgs } from "../types";

export const getSprintsOpAction = createAsyncThunk<
    IOperation | undefined,
    GetOperationActionArgs<{ boardId: string }>,
    IAppAsyncThunkConfig
>("op/sprint/getSprints", async (arg, thunkAPI) => {
    const id = arg.opId || getNewId();

    const operation = OperationSelectors.getOperationWithId(
        thunkAPI.getState(),
        id
    );

    if (isOperationStarted(operation)) {
        return;
    }

    thunkAPI.dispatch(
        dispatchOperationStarted(id, OperationType.GET_SPRINTS, arg.boardId)
    );

    try {
        const result = await SprintAPI.getSprints(arg.boardId);

        if (result && result.errors) {
            throw result.errors;
        }

        thunkAPI.dispatch(SprintActions.bulkAddSprints(result.data!));
        thunkAPI.dispatch(
            dispatchOperationCompleted(
                id,
                OperationType.GET_SPRINTS,
                arg.boardId
            )
        );
    } catch (error) {
        thunkAPI.dispatch(
            dispatchOperationError(
                id,
                OperationType.GET_SPRINTS,
                error,
                arg.boardId
            )
        );
    }

    return OperationSelectors.getOperationWithId(thunkAPI.getState(), id);
});
