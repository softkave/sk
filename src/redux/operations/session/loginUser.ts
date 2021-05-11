import { createAsyncThunk } from "@reduxjs/toolkit";
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

export interface ILoginUserOperationActionArgs {
    email: string;
    password: string;
    remember: boolean;
}

export const loginUserOpAction = createAsyncThunk<
    IOperation | undefined,
    GetOperationActionArgs<ILoginUserOperationActionArgs>,
    IAppAsyncThunkConfig
>("op/session/loginUser", async (arg, thunkAPI) => {
    const opId = arg.opId || getNewId();

    const operation = OperationSelectors.getOperationWithId(
        thunkAPI.getState(),
        opId
    );

    if (isOperationStarted(operation)) {
        return;
    }

    thunkAPI.dispatch(dispatchOperationStarted(opId, OperationType.LoginUser));

    try {
        const result = await UserAPI.login({
            email: arg.email,
            password: arg.password,
        });

        if (result && result.errors) {
            throw result.errors;
        } else if (result && result.token && result.user) {
            completeUserLogin(thunkAPI, result, arg.remember);
        } else {
            throw new Error("An error occurred");
        }

        thunkAPI.dispatch(
            dispatchOperationCompleted(opId, OperationType.LoginUser)
        );
    } catch (error) {
        thunkAPI.dispatch(
            dispatchOperationError(opId, OperationType.LoginUser, error)
        );
    }

    return wrapUpOpAction(thunkAPI, opId, arg);
});
