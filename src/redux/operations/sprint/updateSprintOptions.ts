import { createAsyncThunk } from "@reduxjs/toolkit";
import SprintAPI, {
    IUpdateSprintOptionsAPIParams,
} from "../../../net/sprint/sprint";
import { getDateString, getNewId } from "../../../utils/utils";
import BlockActions from "../../blocks/actions";
import SessionSelectors from "../../session/selectors";
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

export const updateSprintOptionsOpAction = createAsyncThunk<
    IOperation | undefined,
    GetOperationActionArgs<IUpdateSprintOptionsAPIParams>,
    IAppAsyncThunkConfig
>("op/sprint/updateSprintOptions", async (arg, thunkAPI) => {
    const id = arg.opId || getNewId();

    const operation = OperationSelectors.getOperationWithId(
        thunkAPI.getState(),
        id
    );

    if (isOperationStarted(operation)) {
        return;
    }

    thunkAPI.dispatch(
        dispatchOperationStarted(
            id,
            OperationType.UPDATE_SPRINT_OPTIONS,
            arg.boardId
        )
    );

    try {
        const isDemoMode = SessionSelectors.isDemoMode(thunkAPI.getState());
        let updatedAt = getDateString();

        if (!isDemoMode) {
            const result = await SprintAPI.updateSprintOptions(arg);

            if (result && result.errors) {
                throw result.errors;
            }

            updatedAt = result.data!.updatedAt;
        }

        const user = SessionSelectors.assertGetUser(thunkAPI.getState());

        thunkAPI.dispatch(
            BlockActions.updateBlock({
                id: arg.boardId,
                data: {
                    ...arg.data,
                    updatedAt,
                    updatedBy: user.customId,
                },
            })
        );

        thunkAPI.dispatch(
            dispatchOperationCompleted(
                id,
                OperationType.UPDATE_SPRINT_OPTIONS,
                arg.boardId
            )
        );
    } catch (error) {
        await thunkAPI.dispatch(
            dispatchOperationError(
                id,
                OperationType.UPDATE_SPRINT_OPTIONS,
                error,
                arg.boardId
            )
        );
    }

    return OperationSelectors.getOperationWithId(thunkAPI.getState(), id);
});
