import { createAsyncThunk } from "@reduxjs/toolkit";
import ErrorMessages from "../../../models/errorMessages";
import UserAPI from "../../../net/user/user";
import UserSessionStorageFuncs from "../../../storage/userSession";
import { getNewId } from "../../../utils/utils";
import SessionActions from "../../session/actions";
import { IAppAsyncThunkConfig } from "../../types";
import UserActions from "../../users/actions";
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

export interface IChangePasswordOperationActionArgs {
    password: string;
    token: string;
    opId?: string;
}

export const changePasswordOpAction = createAsyncThunk<
    IOperation | undefined,
    GetOperationActionArgs<IChangePasswordOperationActionArgs>,
    IAppAsyncThunkConfig
>("op/session/changePassword", async (arg, thunkAPI) => {
    const opId = arg.opId || getNewId();

    const operation = OperationSelectors.getOperationWithId(
        thunkAPI.getState(),
        opId
    );

    if (isOperationStarted(operation)) {
        return;
    }

    thunkAPI.dispatch(
        dispatchOperationStarted(opId, OperationType.ChangePassword)
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
            dispatchOperationCompleted(opId, OperationType.ChangePassword)
        );
    } catch (error) {
        thunkAPI.dispatch(
            dispatchOperationError(opId, OperationType.ChangePassword, error)
        );
    }

    return wrapUpOpAction(thunkAPI, opId, arg);
});
