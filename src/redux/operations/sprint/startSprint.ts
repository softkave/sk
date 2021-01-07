import { createAsyncThunk } from "@reduxjs/toolkit";
import { ISprint } from "../../../models/sprint/types";
import SprintAPI from "../../../net/sprint/sprint";
import { getDateString, getNewId } from "../../../utils/utils";
import BlockActions from "../../blocks/actions";
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

export const startSprintOpAction = createAsyncThunk<
    IOperation | undefined,
    GetOperationActionArgs<{ sprintId: string }>,
    IAppAsyncThunkConfig
>("op/sprint/startSprint", async (arg, thunkAPI) => {
    const opId = arg.opId || getNewId();

    const operation = OperationSelectors.getOperationWithId(
        thunkAPI.getState(),
        opId
    );

    if (isOperationStarted(operation)) {
        return;
    }

    thunkAPI.dispatch(
        dispatchOperationStarted(opId, OperationType.START_SPRINT, arg.sprintId)
    );

    try {
        const isDemoMode = SessionSelectors.isDemoMode(thunkAPI.getState());
        let startDate = getDateString();

        if (!isDemoMode) {
            const result = await SprintAPI.startSprint(arg.sprintId);

            if (result && result.errors) {
                throw result.errors;
            }

            startDate = result.startDate;
        }

        const user = SessionSelectors.assertGetUser(thunkAPI.getState());
        const sprint = SprintSelectors.getSprint(
            thunkAPI.getState(),
            arg.sprintId
        );

        completeStartSprint(sprint);
        thunkAPI.dispatch(
            SprintActions.updateSprint({
                id: arg.sprintId,
                data: {
                    startDate,
                    startedBy: user.customId,
                },
            })
        );

        thunkAPI.dispatch(
            dispatchOperationCompleted(
                opId,
                OperationType.START_SPRINT,
                arg.sprintId
            )
        );
    } catch (error) {
        thunkAPI.dispatch(
            dispatchOperationError(
                opId,
                OperationType.START_SPRINT,
                error,
                arg.sprintId
            )
        );
    }

    return wrapUpOpAction(thunkAPI, opId, arg);
});

export function completeStartSprint(sprint: ISprint) {
    store.dispatch(
        BlockActions.updateBlock({
            id: sprint.boardId,
            data: {
                currentSprintId: sprint.customId,
            },
        })
    );
}
