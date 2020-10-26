import { createAsyncThunk } from "@reduxjs/toolkit";
import SprintAPI from "../../../net/sprint/sprint";
import { getNewId } from "../../../utils/utils";
import BlockActions from "../../blocks/actions";
import BlockSelectors from "../../blocks/selectors";
import SessionSelectors from "../../session/selectors";
import SprintActions from "../../sprints/actions";
import store from "../../store";
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

export const deleteSprintOpAction = createAsyncThunk<
    IOperation | undefined,
    GetOperationActionArgs<{ sprintId: string }>,
    IAppAsyncThunkConfig
>("op/sprint/deleteSprint", async (arg, thunkAPI) => {
    const id = arg.opId || getNewId();

    const operation = OperationSelectors.getOperationWithId(
        thunkAPI.getState(),
        id
    );

    if (isOperationStarted(operation)) {
        return;
    }

    thunkAPI.dispatch(
        dispatchOperationStarted(id, OperationType.DELETE_SPRINT, arg.sprintId)
    );

    try {
        const isDemoMode = SessionSelectors.isDemoMode(thunkAPI.getState());

        if (!isDemoMode) {
            const result = await SprintAPI.deleteSprint(arg.sprintId);

            if (result && result.errors) {
                throw result.errors;
            }
        }

        removeSprintInTasks(arg.sprintId);
        // updateSprintIndexes(sprint);
        thunkAPI.dispatch(SprintActions.deleteSprint(arg.sprintId));
        thunkAPI.dispatch(
            dispatchOperationCompleted(
                id,
                OperationType.DELETE_SPRINT,
                arg.sprintId
            )
        );
    } catch (error) {
        thunkAPI.dispatch(
            dispatchOperationError(
                id,
                OperationType.DELETE_SPRINT,
                error,
                arg.sprintId
            )
        );
    }

    return OperationSelectors.getOperationWithId(thunkAPI.getState(), id);
});

export function removeSprintInTasks(sprintId: string) {
    const tasks = BlockSelectors.getSprintTasks(store.getState(), sprintId);

    store.dispatch(
        BlockActions.bulkUpdateBlocks(
            tasks.map((task) => {
                return {
                    id: task.customId,
                    data: {
                        taskSprint: null,
                    },
                };
            })
        )
    );
}
