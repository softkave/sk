import { createAsyncThunk } from "@reduxjs/toolkit";
import { ISprint } from "../../../models/sprint/types";
import SprintAPI from "../../../net/sprint/sprint";
import { getNewId } from "../../../utils/utils";
import BlockActions from "../../blocks/actions";
import BlockSelectors from "../../blocks/selectors";
import SessionSelectors from "../../session/selectors";
import SprintActions from "../../sprints/actions";
import SprintSelectors from "../../sprints/selectors";
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
    GetOperationActionArgs<string>,
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
        dispatchOperationStarted(id, OperationType.DELETE_SPRINT, arg)
    );

    try {
        const isDemoMode = SessionSelectors.isDemoMode(thunkAPI.getState());

        if (!isDemoMode) {
            const result = await SprintAPI.deleteSprint(arg);

            if (result && result.errors) {
                throw result.errors;
            }
        }

        const sprint = SprintSelectors.getSprint(thunkAPI.getState(), arg);

        removeSprintInTasks(sprint);
        updateSprintIndexes(sprint);
        thunkAPI.dispatch(SprintActions.deleteSprint(arg));

        thunkAPI.dispatch(
            dispatchOperationCompleted(id, OperationType.DELETE_SPRINT, arg)
        );
    } catch (error) {
        thunkAPI.dispatch(
            dispatchOperationError(id, OperationType.DELETE_SPRINT, error, arg)
        );
    }

    return OperationSelectors.getOperationWithId(thunkAPI.getState(), id);
});

function removeSprintInTasks(sprint: ISprint) {
    const tasks = BlockSelectors.getSprintTasks(
        store.getState(),
        sprint.customId
    );

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

function updateSprintIndexes(sprint: ISprint) {
    const sprints = SprintSelectors.getSprintsFromIndex(
        store.getState(),
        sprint.boardId,
        sprint.sprintIndex
    );

    if (sprints.length === 0) {
        return;
    }

    store.dispatch(
        SprintActions.bulkUpdateSprints(
            sprints.map((spr) => {
                return {
                    id: spr.customId,
                    data: {
                        sprintIndex: spr.sprintIndex - 1,
                    },
                };
            })
        )
    );
}
