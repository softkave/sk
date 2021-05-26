import { createAsyncThunk } from "@reduxjs/toolkit";
import { messages } from "../../../models/messages";
import UserAPI, { IUpdateUserAPIProps } from "../../../net/user/user";
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

export const updateUserOpAction = createAsyncThunk<
    IOperation | undefined,
    GetOperationActionArgs<IUpdateUserAPIProps>,
    IAppAsyncThunkConfig
>("op/session/updateUser", async (arg, thunkAPI) => {
    const opId = arg.opId || getNewId();

    const operation = OperationSelectors.getOperationWithId(
        thunkAPI.getState(),
        opId
    );

    if (isOperationStarted(operation)) {
        return;
    }

    thunkAPI.dispatch(dispatchOperationStarted(opId, OperationType.UpdateUser));

    try {
        const result = await UserAPI.updateUser({
            data: arg.data,
        });

        if (result && result.errors) {
            throw result.errors;
        } else if (result && result.token && result.user) {
            completeUserLogin(thunkAPI, result, false, true);
        } else {
            throw new Error(messages.anErrorOccurred);
        }

        thunkAPI.dispatch(
            dispatchOperationCompleted(opId, OperationType.UpdateUser)
        );
    } catch (error) {
        thunkAPI.dispatch(
            dispatchOperationError(opId, OperationType.UpdateUser, error)
        );
    }

    return wrapUpOpAction(thunkAPI, opId, arg);
});
