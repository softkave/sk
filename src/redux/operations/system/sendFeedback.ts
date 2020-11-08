import { createAsyncThunk } from "@reduxjs/toolkit";
import SystemAPI, { ISendFeedbackAPIProps } from "../../../net/system/api";
import { getNewId } from "../../../utils/utils";
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

export const sendFeedbackOpAction = createAsyncThunk<
    IOperation | undefined,
    GetOperationActionArgs<ISendFeedbackAPIProps>,
    IAppAsyncThunkConfig
>("op/system/sendFeedback", async (arg, thunkAPI) => {
    const id = arg.opId || getNewId();

    const operation = OperationSelectors.getOperationWithId(
        thunkAPI.getState(),
        id
    );

    if (isOperationStarted(operation)) {
        return;
    }

    thunkAPI.dispatch(dispatchOperationStarted(id, OperationType.SendFeedback));

    try {
        const isDemoMode = SessionSelectors.isDemoMode(thunkAPI.getState());

        if (!isDemoMode) {
            const result = await SystemAPI.sendFeedback({
                feedback: arg.feedback,
                description: arg.description,
                notifyEmail: arg.notifyEmail,
            });

            if (result && result.errors) {
                throw result.errors;
            }
        }

        thunkAPI.dispatch(
            dispatchOperationCompleted(id, OperationType.SendFeedback)
        );
    } catch (error) {
        thunkAPI.dispatch(
            dispatchOperationError(id, OperationType.SendFeedback, error)
        );
    }

    return OperationSelectors.getOperationWithId(thunkAPI.getState(), id);
});
