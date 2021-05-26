import { createAsyncThunk } from "@reduxjs/toolkit";
import randomColor from "randomcolor";
import { IClient } from "../../../models/user/user";
import UserAPI, { IUserLoginResult } from "../../../net/user/user";
import UserSessionStorageFuncs, {
    sessionVariables,
} from "../../../storage/userSession";
import { getNewId } from "../../../utils/utils";
import SessionActions from "../../session/actions";
import { IAppAsyncThunkConfig, IStoreLikeObject } from "../../types";
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
    const opId = arg.opId || getNewId();

    const operation = OperationSelectors.getOperationWithId(
        thunkAPI.getState(),
        opId
    );

    if (isOperationStarted(operation)) {
        return;
    }

    thunkAPI.dispatch(dispatchOperationStarted(opId, OperationType.SignupUser));

    try {
        const data = { ...arg, color: randomColor() };
        const result = await UserAPI.signup({
            user: {
                color: data.color,
                email: data.email,
                name: data.name,
                password: data.password,
            },
        });

        if (result && result.errors) {
            throw result.errors;
        } else if (result && result.token && result.user) {
            // TODO: should we save the user token after signup or only after login?
            completeUserLogin(thunkAPI, result, true);
        } else {
            throw new Error("An error occurred");
        }

        thunkAPI.dispatch(
            dispatchOperationCompleted(opId, OperationType.SignupUser)
        );
    } catch (error) {
        thunkAPI.dispatch(
            dispatchOperationError(opId, OperationType.SignupUser, error)
        );
    }

    return wrapUpOpAction(thunkAPI, opId, arg);
});

export function localStoreClientData(client: IClient) {
    // TODO: we should ideally send the current client data to the server if set
    // if the clientIds don't match
    UserSessionStorageFuncs.setItem(sessionVariables.clientId, client.clientId);
    UserSessionStorageFuncs.setItem(
        sessionVariables.hasUserSeenNotificationsPermissionDialog,
        client.hasUserSeenNotificationsPermissionDialog
    );

    UserSessionStorageFuncs.setItem(
        sessionVariables.muteChatNotifications,
        client.muteChatNotifications
    );

    UserSessionStorageFuncs.setItem(
        sessionVariables.isSubcribedToPushNotifications,
        client.isSubcribedToPushNotifications
    );
}

export function completeUserLogin(
    store: IStoreLikeObject,
    result: IUserLoginResult,
    remember: boolean,
    rememberOnlyIfTokenExists?: boolean
) {
    store.dispatch(UserActions.addUser(result.user));
    store.dispatch(
        SessionActions.loginUser({
            token: result.token,
            userId: result.user.customId,
            client: result.client,
        })
    );

    if (remember) {
        UserSessionStorageFuncs.saveUserToken(result.token);
    } else if (rememberOnlyIfTokenExists) {
        UserSessionStorageFuncs.saveTokenIfExists(result.token);
    }

    if (result.client) {
        localStoreClientData(result.client);
    }
}
