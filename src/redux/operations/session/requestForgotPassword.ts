import { createAsyncThunk } from "@reduxjs/toolkit";
import UserAPI from "../../../net/user";
import { getNewId } from "../../../utils/utils";
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

export interface IRequestForgotPasswordOperationActionArgs {
    email: string;
}

export const requestForgotPasswordOperationAction = createAsyncThunk<
    IOperation | undefined,
    GetOperationActionArgs<IRequestForgotPasswordOperationActionArgs>,
    IAppAsyncThunkConfig
>("session/requestForgotPassword", async (arg, thunkAPI) => {
    const id = arg.opId || getNewId();

    const operation = OperationSelectors.getOperationWithId(
        thunkAPI.getState(),
        id
    );

    if (isOperationStarted(operation)) {
        return;
    }

    await thunkAPI.dispatch(
        dispatchOperationStarted(id, OperationType.RequestForgotPassword)
    );

    try {
        const result = await UserAPI.forgotPassword(arg.email);

        if (result && result.errors) {
            throw result.errors;
        }

        await thunkAPI.dispatch(
            dispatchOperationCompleted(id, OperationType.RequestForgotPassword)
        );
    } catch (error) {
        await thunkAPI.dispatch(
            dispatchOperationError(
                id,
                OperationType.RequestForgotPassword,
                error
            )
        );
    }

    return OperationSelectors.getOperationWithId(thunkAPI.getState(), id);
});
