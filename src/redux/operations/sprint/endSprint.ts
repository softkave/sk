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
} from "../operation";
import OperationType from "../OperationType";
import OperationSelectors from "../selectors";
import { GetOperationActionArgs } from "../types";

export const endSprintOpAction = createAsyncThunk<
    IOperation | undefined,
    GetOperationActionArgs<string>,
    IAppAsyncThunkConfig
>("op/sprint/endSprint", async (arg, thunkAPI) => {
    const id = arg.opId || getNewId();

    const operation = OperationSelectors.getOperationWithId(
        thunkAPI.getState(),
        id
    );

    if (isOperationStarted(operation)) {
        return;
    }

    thunkAPI.dispatch(
        dispatchOperationStarted(id, OperationType.END_SPRINT, arg)
    );

    try {
        const isDemoMode = SessionSelectors.isDemoMode(thunkAPI.getState());
        let endDate = getDateString();

        if (!isDemoMode) {
            const result = await SprintAPI.endSprint(arg);

            if (result && result.errors) {
                throw result.errors;
            }

            endDate = result.data!.endDate;
        }

        const sprint = SprintSelectors.getSprint(thunkAPI.getState(), arg);
        const user = SessionSelectors.assertGetUser(thunkAPI.getState());

        moveIncompleteTasksToTheNextSprint(sprint, endDate);
        thunkAPI.dispatch(
            SprintActions.updateSprint({
                id: arg,
                data: {
                    endDate,
                    endedBy: user.customId,
                },
            })
        );

        thunkAPI.dispatch(
            BlockActions.updateBlock({
                id: sprint.boardId,
                data: {
                    currentSprintId: null,
                },
            })
        );

        thunkAPI.dispatch(
            dispatchOperationCompleted(id, OperationType.END_SPRINT, arg)
        );
    } catch (error) {
        thunkAPI.dispatch(
            dispatchOperationError(id, OperationType.END_SPRINT, error, arg)
        );
    }

    return OperationSelectors.getOperationWithId(thunkAPI.getState(), id);
});

function moveIncompleteTasksToTheNextSprint(sprint: ISprint, date: string) {
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
        return task.status !== taskCompleteStatus.customId;
    });

    if (incompleteTasks.length === 0) {
        return;
    }

    const nextSprint = SprintSelectors.getNextSprintAfterIndex(
        store.getState(),
        sprint.boardId,
        sprint.sprintIndex
    );

    if (!nextSprint) {
        return;
    }

    const user = SessionSelectors.assertGetUser(store.getState());
    store.dispatch(
        BlockActions.bulkUpdateBlocks(
            tasks.map((task) => {
                return {
                    id: task.customId,
                    data: {
                        taskSprint: {
                            sprintId: nextSprint.customId,
                            assignedAt: date,
                            assignedBy: user.customId,
                        },
                    },
                };
            })
        )
    );
}
