import { createAsyncThunk } from "@reduxjs/toolkit";
import { ISprint } from "../../../models/sprint/types";
import SprintAPI from "../../../net/sprint/sprint";
import { getNewId } from "../../../utils/utils";
import SessionSelectors from "../../session/selectors";
import SprintActions from "../../sprints/actions";
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

export const getSprintsOpAction = createAsyncThunk<
    IOperation | undefined,
    GetOperationActionArgs<{ boardId: string }>,
    IAppAsyncThunkConfig
>("op/sprint/getSprints", async (arg, thunkAPI) => {
    const opId = arg.opId || getNewId();

    const operation = OperationSelectors.getOperationWithId(
        thunkAPI.getState(),
        opId
    );

    if (isOperationStarted(operation)) {
        return;
    }

    thunkAPI.dispatch(
        dispatchOperationStarted(opId, OperationType.GetSprints, arg.boardId)
    );

    try {
        const isDemoMode = SessionSelectors.isDemoMode(thunkAPI.getState());
        let sprints: ISprint[] = [];

        if (!isDemoMode) {
            const result = await SprintAPI.getSprints(arg.boardId);

            if (result && result.errors) {
                throw result.errors;
            }

            sprints = result.sprints || [];
        }

        thunkAPI.dispatch(SprintActions.bulkAddSprints(sprints));
        thunkAPI.dispatch(
            dispatchOperationCompleted(
                opId,
                OperationType.GetSprints,
                arg.boardId
            )
        );
    } catch (error) {
        thunkAPI.dispatch(
            dispatchOperationError(
                opId,
                OperationType.GetSprints,
                error,
                arg.boardId
            )
        );
    }

    return wrapUpOpAction(thunkAPI, opId, arg);
});
