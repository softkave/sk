import { createAsyncThunk } from "@reduxjs/toolkit";
import { ISprint } from "../../../models/sprint/types";
import SprintAPI, { IAddSprintAPIParams } from "../../../net/sprint/sprint";
import { getNewId, getNewTempId } from "../../../utils/utils";
import BlockSelectors from "../../blocks/selectors";
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
        const isDemoMode = SessionSelectors.isDemoMode(thunkAPI.getState());

        if (!isDemoMode) {
            const result = await SprintAPI.addSprint(arg);

            if (result && result.errors) {
                throw result.errors;
            }

            thunkAPI.dispatch(SprintActions.addSprint(result.data!));
        } else {
            const board = BlockSelectors.getBlock(
                thunkAPI.getState(),
                arg.boardId
            );

            const boardSprintsCount = SprintSelectors.countSprints(
                thunkAPI.getState(),
                arg.boardId
            );

            const sprint: ISprint = {
                customId: getNewTempId(),
                boardId: arg.boardId,
                orgId: board.rootBlockId!,
                duration: board.sprintOptions!.duration,
                sprintIndex: boardSprintsCount,
                name: arg.name,
            };

            thunkAPI.dispatch(SprintActions.addSprint(sprint));
        }

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
