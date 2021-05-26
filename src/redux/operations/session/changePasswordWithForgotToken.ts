import { createAsyncThunk } from "@reduxjs/toolkit";
import ErrorMessages from "../../../models/messages";
import UserAPI from "../../../net/user/user";
import { getNewId } from "../../../utils/utils";
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
import { completeUserLogin } from "./signupUser";

export interface IChangePasswordWithForgotTokenOperationActionArgs {
    password: string;
    token: string;
    opId?: string;
}

export const changePasswordWithForgotTokenOpAction = createAsyncThunk<
    IOperation | undefined,
    GetOperationActionArgs<IChangePasswordWithForgotTokenOperationActionArgs>,
    IAppAsyncThunkConfig
>("op/session/changePasswordWithForgotToken", async (arg, thunkAPI) => {
    const opId = arg.opId || getNewId();

    const operation = OperationSelectors.getOperationWithId(
        thunkAPI.getState(),
        opId
    );

    if (isOperationStarted(operation)) {
        return;
    }

    thunkAPI.dispatch(
        dispatchOperationStarted(
            opId,
            OperationType.ChangePasswordWithForgotToken
        )
    );

    try {
        const result = await UserAPI.changePasswordWithToken({
            password: arg.password,
            token: arg.token,
        });

        if (result && result.errors) {
            throw result.errors;
        } else if (result && result.token && result.user) {
            completeUserLogin(thunkAPI, result, false, true);
        } else {
            throw new Error(ErrorMessages.AN_ERROR_OCCURRED);
        }

        thunkAPI.dispatch(
            dispatchOperationCompleted(
                opId,
                OperationType.ChangePasswordWithForgotToken
            )
        );
    } catch (error) {
        thunkAPI.dispatch(
            dispatchOperationError(
                opId,
                OperationType.ChangePasswordWithForgotToken,
                error
            )
        );
    }

    return wrapUpOpAction(thunkAPI, opId, arg);
});
