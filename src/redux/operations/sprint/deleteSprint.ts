import { createAsyncThunk } from "@reduxjs/toolkit";
import { IBlock } from "../../../models/block/block";
import { ISprint } from "../../../models/sprint/types";
import SprintAPI from "../../../net/sprint/sprint";
import { getNewId } from "../../../utils/utils";
import BlockActions from "../../blocks/actions";
import BlockSelectors from "../../blocks/selectors";
import SessionSelectors from "../../session/selectors";
import SprintActions, { IUpdateSprintActionArgs } from "../../sprints/actions";
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

export const deleteSprintOpAction = createAsyncThunk<
    IOperation | undefined,
    GetOperationActionArgs<{ sprintId: string }>,
    IAppAsyncThunkConfig
>("op/sprint/deleteSprint", async (arg, thunkAPI) => {
    const opId = arg.opId || getNewId();

    const operation = OperationSelectors.getOperationWithId(
        thunkAPI.getState(),
        opId
    );

    if (isOperationStarted(operation)) {
        return;
    }

    thunkAPI.dispatch(
        dispatchOperationStarted(opId, OperationType.DeleteSprint, arg.sprintId)
    );

    try {
        const isDemoMode = SessionSelectors.isDemoMode(thunkAPI.getState());

        if (!isDemoMode) {
            const result = await SprintAPI.deleteSprint(arg.sprintId);

            if (result && result.errors) {
                throw result.errors;
            }
        }

        const sprint = SprintSelectors.getSprint(
            thunkAPI.getState(),
            arg.sprintId
        );

        const board = BlockSelectors.getBlock(
            thunkAPI.getState(),
            sprint.boardId
        );

        completeDeleteSprint(sprint, board);
        thunkAPI.dispatch(SprintActions.deleteSprint(arg.sprintId));
        thunkAPI.dispatch(
            dispatchOperationCompleted(
                opId,
                OperationType.DeleteSprint,
                arg.sprintId
            )
        );
    } catch (error) {
        thunkAPI.dispatch(
            dispatchOperationError(
                opId,
                OperationType.DeleteSprint,
                error,
                arg.sprintId
            )
        );
    }

    return wrapUpOpAction(thunkAPI, opId, arg);
});

export function completeDeleteSprint(sprint: ISprint, board: IBlock) {
    const boardUpdates: Partial<IBlock> = {};

    if (sprint.customId === board.lastSprintId) {
        boardUpdates.lastSprintId = sprint.prevSprintId;
    }

    if (Object.keys(boardUpdates).length > 0) {
        // If has board updates
        store.dispatch(
            BlockActions.updateBlock({
                id: board.customId,
                data: boardUpdates,
            })
        );
    }

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

    const bulkSprintUpdates: IUpdateSprintActionArgs[] = [];

    if (sprint.prevSprintId) {
        bulkSprintUpdates.push({
            id: sprint.prevSprintId,
            data: {
                nextSprintId: sprint.nextSprintId || null,
            },
        });
    }

    if (sprint.nextSprintId) {
        bulkSprintUpdates.push({
            id: sprint.nextSprintId,
            data: {
                prevSprintId: sprint.prevSprintId!,
            },
        });
    }

    store.dispatch(SprintActions.bulkUpdateSprints(bulkSprintUpdates));
}
