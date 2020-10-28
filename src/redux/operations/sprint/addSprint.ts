import { createAsyncThunk } from "@reduxjs/toolkit";
import { IBlock } from "../../../models/block/block";
import { ISprint } from "../../../models/sprint/types";
import SprintAPI, { IAddSprintAPIParams } from "../../../net/sprint/sprint";
import { getDateString, getNewId, getNewTempId } from "../../../utils/utils";
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

export const addSprintOpAction = createAsyncThunk<
    IOperation | undefined,
    GetOperationActionArgs<IAddSprintAPIParams>,
    IAppAsyncThunkConfig
>("op/sprint/addSprint", async (arg, thunkAPI) => {
    const id = arg.opId || getNewId();

    const operation = OperationSelectors.getOperationWithId(
        thunkAPI.getState(),
        id
    );

    if (isOperationStarted(operation)) {
        return;
    }

    thunkAPI.dispatch(
        dispatchOperationStarted(id, OperationType.ADD_SPRINT, arg.boardId)
    );

    try {
        let sprint: ISprint;
        const isDemoMode = SessionSelectors.isDemoMode(thunkAPI.getState());
        const board = BlockSelectors.getBlock(thunkAPI.getState(), arg.boardId);

        if (!isDemoMode) {
            const result = await SprintAPI.addSprint(arg);

            if (result && result.errors) {
                throw result.errors;
            }

            sprint = result.data!;
        } else {
            const user = SessionSelectors.assertGetUser(thunkAPI.getState());
            let sprintIndex: number;
            const prevSprint = board.lastSprintId
                ? SprintSelectors.getSprint(
                      thunkAPI.getState(),
                      board.lastSprintId
                  )
                : null;

            if (prevSprint) {
                sprintIndex = prevSprint.sprintIndex + 1;
            } else {
                sprintIndex = 1;
            }

            sprint = {
                customId: getNewTempId(),
                boardId: arg.boardId,
                orgId: board.rootBlockId!,
                duration: arg.data.duration,
                sprintIndex,
                name: arg.data.name,
                createdAt: getDateString(),
                createdBy: user.customId,
                prevSprintId: board.lastSprintId,
            };
        }

        thunkAPI.dispatch(SprintActions.addSprint(sprint));
        completeAddSprint(sprint, board);
        thunkAPI.dispatch(
            dispatchOperationCompleted(
                id,
                OperationType.ADD_SPRINT,
                arg.boardId
            )
        );
    } catch (error) {
        thunkAPI.dispatch(
            dispatchOperationError(
                id,
                OperationType.ADD_SPRINT,
                error,
                arg.boardId
            )
        );
    }

    return OperationSelectors.getOperationWithId(thunkAPI.getState(), id);
});

export function completeAddSprint(sprint: ISprint, board: IBlock) {
    if (board.lastSprintId) {
        store.dispatch(
            SprintActions.updateSprint({
                id: board.lastSprintId,
                data: {
                    nextSprintId: sprint.customId,
                },
            })
        );
    }

    store.dispatch(
        BlockActions.updateBlock({
            id: sprint.boardId,
            data: {
                lastSprintId: sprint.customId,
            },
        })
    );
}
