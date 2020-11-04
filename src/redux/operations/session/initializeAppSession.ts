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
} from "../operation";
import OperationType from "../OperationType";
import OperationSelectors from "../selectors";
import { IOperationActionBaseArgs } from "../types";

export const initializeAppSessionOpAction = createAsyncThunk<
    IOperation | undefined,
    IOperationActionBaseArgs,
    IAppAsyncThunkConfig
>("op/session/initializeAppSession", async (arg, thunkAPI) => {
    const id = arg.opId || getNewId();

    const operation = OperationSelectors.getOperationWithId(
        thunkAPI.getState(),
        id
    );

    if (isOperationStarted(operation)) {
        return;
    }

    thunkAPI.dispatch(
        dispatchOperationStarted(id, OperationType.InitializeAppSession)
    );

    try {
        const token = UserSessionStorageFuncs.getUserToken();

        if (token) {
            const result = await UserAPI.getUserData(token);

            if (result && result.errors) {
                throw result.errors;
            }

            const { user } = result;

            thunkAPI.dispatch(UserActions.addUser(user));
            thunkAPI.dispatch(
                SessionActions.loginUser({
                    token,
                    userId: user.customId,
                    clientId: result.clientId,
                })
            );
        } else {
            thunkAPI.dispatch(SessionActions.setSessionToWeb());
        }

        thunkAPI.dispatch(
            dispatchOperationCompleted(id, OperationType.InitializeAppSession)
        );
    } catch (error) {
        thunkAPI.dispatch(SessionActions.setSessionToWeb());
        thunkAPI.dispatch(
            dispatchOperationError(
                id,
                OperationType.InitializeAppSession,
                error
            )
        );
    }

    return OperationSelectors.getOperationWithId(thunkAPI.getState(), id);
});
