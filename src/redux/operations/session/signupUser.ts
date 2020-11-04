import { createAsyncThunk } from "@reduxjs/toolkit";
import randomColor from "randomcolor";
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

export interface ISignupUserOperationActionArgs {
    name: string;
    email: string;
    password: string;
}

export const signupUserOpAction = createAsyncThunk<
    IOperation | undefined,
    GetOperationActionArgs<ISignupUserOperationActionArgs>,
    IAppAsyncThunkConfig
>("op/session/signupUser", async (arg, thunkAPI) => {
    const id = arg.opId || getNewId();

    const operation = OperationSelectors.getOperationWithId(
        thunkAPI.getState(),
        id
    );

    if (isOperationStarted(operation)) {
        return;
    }

    thunkAPI.dispatch(dispatchOperationStarted(id, OperationType.SignupUser));

    try {
        const data = { ...arg, color: randomColor() };
        const result = await UserAPI.signup(data);

        if (result && result.errors) {
            throw result.errors;
        } else if (result && result.token && result.user) {
            thunkAPI.dispatch(UserActions.addUser(result.user));
            thunkAPI.dispatch(
                SessionActions.loginUser({
                    token: result.token,
                    userId: result.user.customId,
                    clientId: result.clientId,
                })
            );

            // TODO: should we save the user token after signup or only after login?
            UserSessionStorageFuncs.saveUserToken(result.token);
        } else {
            throw new Error("An error occurred");
        }

        thunkAPI.dispatch(
            dispatchOperationCompleted(id, OperationType.SignupUser)
        );
    } catch (error) {
        thunkAPI.dispatch(
            dispatchOperationError(id, OperationType.SignupUser, error)
        );
    }

    return OperationSelectors.getOperationWithId(thunkAPI.getState(), id);
});
