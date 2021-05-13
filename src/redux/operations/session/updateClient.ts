import { createAsyncThunk } from "@reduxjs/toolkit";
import UserAPI, { IUpdateClientEndpointParams } from "../../../net/user/user";
import UserSessionStorageFuncs, {
    sessionVariables,
} from "../../../storage/userSession";
import { getNewId } from "../../../utils/utils";
import SessionActions from "../../session/actions";
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
import { localStoreClientData } from "./signupUser";

export const updateClientOpAction = createAsyncThunk<
    IOperation | undefined,
    GetOperationActionArgs<IUpdateClientEndpointParams>,
    IAppAsyncThunkConfig
>("op/session/updateClient", async (arg, thunkAPI) => {
    const opId = arg.opId || getNewId();

    const operation = OperationSelectors.getOperationWithId(
        thunkAPI.getState(),
        opId
    );

    if (isOperationStarted(operation)) {
        return;
    }

    thunkAPI.dispatch(
        dispatchOperationStarted(opId, OperationType.UpdateClient)
    );

    try {
        const result = await UserAPI.updateClient({
            data: arg.data,
        });

        if (result && result.errors) {
            throw result.errors;
        }

        UserSessionStorageFuncs.setItem(
            sessionVariables.clientId,
            result.client.clientId
        );

        localStoreClientData(result.client);
        thunkAPI.dispatch(SessionActions.updateClient(result.client));
        thunkAPI.dispatch(
            dispatchOperationCompleted(opId, OperationType.UpdateClient)
        );
    } catch (error) {
        thunkAPI.dispatch(
            dispatchOperationError(opId, OperationType.UpdateClient, error)
        );
    }

    return wrapUpOpAction(thunkAPI, opId, arg);
});
