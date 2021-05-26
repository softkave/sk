import { createAsyncThunk } from "@reduxjs/toolkit";
import ErrorMessages from "../../../models/messages";
import UserAPI, { IChangePasswordAPIProps } from "../../../net/user/user";
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

export const changePasswordWithCurrentPasswordOpAction = createAsyncThunk<
    IOperation | undefined,
    GetOperationActionArgs<IChangePasswordAPIProps>,
    IAppAsyncThunkConfig
>("op/session/changePasswordWithCurrentPassword", async (arg, thunkAPI) => {
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
            OperationType.ChangePasswordWithCurrentPassword
        )
    );

    try {
        const result = await UserAPI.changePassword({
            password: arg.password,
            currentPassword: arg.currentPassword,
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
                OperationType.ChangePasswordWithCurrentPassword
            )
        );
    } catch (error) {
        thunkAPI.dispatch(
            dispatchOperationError(
                opId,
                OperationType.ChangePasswordWithCurrentPassword,
                error
            )
        );
    }

    return wrapUpOpAction(thunkAPI, opId, arg);
});
