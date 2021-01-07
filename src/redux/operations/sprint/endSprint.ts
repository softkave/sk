import { createAsyncThunk } from "@reduxjs/toolkit";
import { ISprint } from "../../../models/sprint/types";
import SprintAPI from "../../../net/sprint/sprint";
import { getDateString, getNewId } from "../../../utils/utils";
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
    wrapUpOpAction,
} from "../operation";
import OperationType from "../OperationType";
import OperationSelectors from "../selectors";
import { GetOperationActionArgs } from "../types";

export const endSprintOpAction = createAsyncThunk<
    IOperation | undefined,
    GetOperationActionArgs<{ sprintId: string }>,
    IAppAsyncThunkConfig
>("op/sprint/endSprint", async (arg, thunkAPI) => {
    const opId = arg.opId || getNewId();

    const operation = OperationSelectors.getOperationWithId(
        thunkAPI.getState(),
        opId
    );

    if (isOperationStarted(operation)) {
        return;
    }

    thunkAPI.dispatch(
        dispatchOperationStarted(opId, OperationType.END_SPRINT, arg.sprintId)
    );

    try {
        const isDemoMode = SessionSelectors.isDemoMode(thunkAPI.getState());
        let endDate = getDateString();

        if (!isDemoMode) {
            const result = await SprintAPI.endSprint(arg.sprintId);

            if (result && result.errors) {
                throw result.errors;
            }

            endDate = result.endDate;
        }

        const user = SessionSelectors.assertGetUser(thunkAPI.getState());
        const sprint = SprintSelectors.getSprint(
            thunkAPI.getState(),
            arg.sprintId
        );

        completeEndSprint(sprint, endDate);
        thunkAPI.dispatch(
            SprintActions.updateSprint({
                id: arg.sprintId,
                data: {
                    endDate,
                    endedBy: user.customId,
                },
            })
        );

        thunkAPI.dispatch(
            dispatchOperationCompleted(
                opId,
                OperationType.END_SPRINT,
                arg.sprintId
            )
        );
    } catch (error) {
        thunkAPI.dispatch(
            dispatchOperationError(
                opId,
                OperationType.END_SPRINT,
                error,
                arg.sprintId
            )
        );
    }

    return wrapUpOpAction(thunkAPI, opId, arg);
});

export function completeEndSprint(sprint: ISprint, date: string) {
    store.dispatch(
        BlockActions.updateBlock({
            id: sprint.boardId,
            data: {
                currentSprintId: null,
            },
        })
    );

    const board = BlockSelectors.getBlock(store.getState(), sprint.boardId);
    const statusList = board.boardStatuses || [];
    const taskCompleteStatus = statusList[statusList.length - 1];

    if (!taskCompleteStatus) {
        return;
    }

    const tasks = BlockSelectors.getSprintTasks(
        store.getState(),
        sprint.customId
    );

    const incompleteTasks = tasks.filter((task) => {
        return (
            task.taskSprint &&
            task.taskSprint.sprintId === sprint.customId &&
            task.status !== taskCompleteStatus.customId
        );
    });

    if (incompleteTasks.length === 0) {
        return;
    }

    let nextSprint: ISprint;

    if (sprint.nextSprintId) {
        nextSprint = SprintSelectors.getSprint(
            store.getState(),
            sprint.nextSprintId
        );
    }

    const user = SessionSelectors.assertGetUser(store.getState());
    const incompleteTasksUpdates = incompleteTasks.map((task) => ({
        id: task.customId,
        data: {
            taskSprint: nextSprint
                ? {
                      sprintId: nextSprint.customId,
                      assignedAt: date,
                      assignedBy: user.customId,
                  }
                : null,
        },
    }));

    store.dispatch(BlockActions.bulkUpdateBlocks(incompleteTasksUpdates));
}
