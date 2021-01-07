import { createAsyncThunk } from "@reduxjs/toolkit";
import SprintAPI, { IUpdateSprintAPIParams } from "../../../net/sprint/sprint";
import { getDateString, getNewId } from "../../../utils/utils";
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

export const updateSprintOpAction = createAsyncThunk<
    IOperation | undefined,
    GetOperationActionArgs<IUpdateSprintAPIParams>,
    IAppAsyncThunkConfig
>("op/sprint/updateSprint", async (arg, thunkAPI) => {
    const opId = arg.opId || getNewId();

    const operation = OperationSelectors.getOperationWithId(
        thunkAPI.getState(),
        opId
    );

    if (isOperationStarted(operation)) {
        return;
    }

    thunkAPI.dispatch(
        dispatchOperationStarted(opId, OperationType.UpdateSprint, arg.sprintId)
    );

    try {
        const isDemoMode = SessionSelectors.isDemoMode(thunkAPI.getState());
        let updatedAt = getDateString();

        if (!isDemoMode) {
            const result = await SprintAPI.updateSprint({
                sprintId: arg.sprintId,
                data: {
                    name: arg.data.name,
                    duration: arg.data.duration,
                },
            });

            if (result && result.errors) {
                throw result.errors;
            }

            updatedAt = result.sprint.updatedAt;
        }

        const user = SessionSelectors.assertGetUser(thunkAPI.getState());

        thunkAPI.dispatch(
            SprintActions.updateSprint({
                id: arg.sprintId,
                data: {
                    ...arg.data,
                    updatedAt,
                    updatedBy: user.customId,
                },
            })
        );

        thunkAPI.dispatch(
            dispatchOperationCompleted(
                opId,
                OperationType.UpdateSprint,
                arg.sprintId
            )
        );
    } catch (error) {
        thunkAPI.dispatch(
            dispatchOperationError(
                opId,
                OperationType.UpdateSprint,
                error,
                arg.sprintId
            )
        );
    }

    return wrapUpOpAction(thunkAPI, opId, arg);
});
