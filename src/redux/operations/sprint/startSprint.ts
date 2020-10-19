import { createAsyncThunk } from "@reduxjs/toolkit";
import SprintAPI from "../../../net/sprint/sprint";
import { getDateString, getNewId } from "../../../utils/utils";
import BlockActions from "../../blocks/actions";
import SessionSelectors from "../../session/selectors";
import SprintActions from "../../sprints/actions";
import SprintSelectors from "../../sprints/selectors";
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

export const startSprintOpAction = createAsyncThunk<
    IOperation | undefined,
    GetOperationActionArgs<string>,
    IAppAsyncThunkConfig
>("op/sprint/startSprint", async (arg, thunkAPI) => {
    const id = arg.opId || getNewId();

    const operation = OperationSelectors.getOperationWithId(
        thunkAPI.getState(),
        id
    );

    if (isOperationStarted(operation)) {
        return;
    }

    thunkAPI.dispatch(
        dispatchOperationStarted(id, OperationType.START_SPRINT, arg)
    );

    try {
        const isDemoMode = SessionSelectors.isDemoMode(thunkAPI.getState());
        let startDate = getDateString();

        if (!isDemoMode) {
            const result = await SprintAPI.startSprint(arg);

            if (result && result.errors) {
                throw result.errors;
            }

            startDate = result.data!.startDate;
        }

        const user = SessionSelectors.assertGetUser(thunkAPI.getState());
        const sprint = SprintSelectors.getSprint(thunkAPI.getState(), arg);

        thunkAPI.dispatch(
            SprintActions.updateSprint({
                id: arg,
                data: {
                    startDate,
                    startedBy: user.customId,
                },
            })
        );

        thunkAPI.dispatch(
            BlockActions.updateBlock({
                id: sprint.boardId,
                data: {
                    currentSprintId: sprint.customId,
                },
            })
        );

        thunkAPI.dispatch(
            dispatchOperationCompleted(id, OperationType.AddBlock, arg)
        );
    } catch (error) {
        thunkAPI.dispatch(
            dispatchOperationError(id, OperationType.AddBlock, error, arg)
        );
    }

    return OperationSelectors.getOperationWithId(thunkAPI.getState(), id);
});
