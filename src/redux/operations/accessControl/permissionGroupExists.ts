import { createAsyncThunk } from "@reduxjs/toolkit";
import { IBlock, IFormBlock } from "../../../models/block/block";
import AccessControlAPI, {
    IPermissionGroupExistsAPIParams,
} from "../../../net/access-control/fns";
import { getNewId } from "../../../utils/utils";
import SessionSelectors from "../../session/selectors";
import { IAppAsyncThunkConfig, IStoreLikeObject } from "../../types";
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

export const permissionGroupExistsOpAction = createAsyncThunk<
    IOperation<boolean> | undefined,
    GetOperationActionArgs<IPermissionGroupExistsAPIParams>,
    IAppAsyncThunkConfig
>("op/accessControl/permissionGroupExists", async (arg, thunkAPI) => {
    const opId = arg.opId || getNewId();

    const operation = OperationSelectors.getOperationWithId(
        thunkAPI.getState(),
        opId
    );

    if (isOperationStarted(operation)) {
        return;
    }

    thunkAPI.dispatch(dispatchOperationStarted(opId, OperationType.AddBlock));

    try {
        const isDemoMode = SessionSelectors.isDemoMode(thunkAPI.getState());
        let exists = false;

        if (!isDemoMode) {
            const result = await AccessControlAPI.permissionGroupExists({
                blockId: arg.blockId,
                name: arg.name,
            });

            if (result.errors) {
                throw result.errors;
            }

            exists = result.exists;
        } else {
        }

        thunkAPI.dispatch(
            dispatchOperationCompleted(
                opId,
                OperationType.AddBlock,
                null,
                exists
            )
        );
    } catch (error) {
        thunkAPI.dispatch(
            dispatchOperationError(opId, OperationType.AddBlock, error)
        );
    }

    return wrapUpOpAction(thunkAPI, opId, arg);
});
