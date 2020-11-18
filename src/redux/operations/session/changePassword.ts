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
} from "../operation";
import OperationType from "../OperationType";
import OperationSelectors from "../selectors";
import { GetOperationActionArgs } from "../types";

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
    const id = arg.opId || getNewId();

    const operation = OperationSelectors.getOperationWithId(
        thunkAPI.getState(),
        id
    );

    if (isOperationStarted(operation)) {
        return;
    }

    thunkAPI.dispatch(
        dispatchOperationStarted(id, OperationType.ChangePassword)
    );

    try {
        const result = await UserAPI.changePasswordWithToken({
            password: arg.password,
            token: arg.token,
        });

        if (result && result.errors) {
            throw result.errors;
        } else if (result && result.token && result.user) {
            thunkAPI.dispatch(UserActions.addUser(result.user));
            thunkAPI.dispatch(
                SessionActions.loginUser({
                    token: result.token,
                    userId: result.user.customId,
                })
            );

            UserSessionStorageFuncs.saveTokenIfExists(result.token);
        } else {
            throw new Error(ErrorMessages.AN_ERROR_OCCURRED);
        }

        thunkAPI.dispatch(
            dispatchOperationCompleted(id, OperationType.ChangePassword)
        );
    } catch (error) {
        thunkAPI.dispatch(
            dispatchOperationError(id, OperationType.ChangePassword, error)
        );
    }

    return OperationSelectors.getOperationWithId(thunkAPI.getState(), id);
});
