import { createAsyncThunk } from "@reduxjs/toolkit";
import AccessControlAPI, {
    IDeletePermissionGroupsAPIParams,
} from "../../../net/access-control/fns";
import { getNewId } from "../../../utils/utils";
import PermissionGroupActions from "../../permissionGroups/actions";
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

export const deletePermissionGroupsOpAction = createAsyncThunk<
    IOperation | undefined,
    GetOperationActionArgs<IDeletePermissionGroupsAPIParams>,
    IAppAsyncThunkConfig
>("op/accessControl/deletePermissionGroups", async (arg, thunkAPI) => {
    const opId = arg.opId || getNewId();

    const operation = OperationSelectors.getOperationWithId(
        thunkAPI.getState(),
        opId
    );

    if (isOperationStarted(operation)) {
        return;
    }

    thunkAPI.dispatch(
        dispatchOperationStarted(opId, OperationType.DeletePermissionGroups)
    );

    try {
        const isDemoMode = SessionSelectors.isDemoMode(thunkAPI.getState());

        if (!isDemoMode) {
            const { errors } = await AccessControlAPI.deletePermissionGroups({
                blockId: arg.blockId,
                permissionGroups: arg.permissionGroups,
            });

            if (errors) {
                throw errors;
            }
        } else {
        }

        storeDeletePermissionGroups(thunkAPI, arg.permissionGroups);
        thunkAPI.dispatch(
            dispatchOperationCompleted(
                opId,
                OperationType.DeletePermissionGroups,
                null
            )
        );
    } catch (error) {
        thunkAPI.dispatch(
            dispatchOperationError(
                opId,
                OperationType.DeletePermissionGroups,
                error
            )
        );
    }

    return wrapUpOpAction(thunkAPI, opId, arg);
});

export const storeDeletePermissionGroups = (
    store: IStoreLikeObject,
    ids: string[]
) => {
    store.dispatch(PermissionGroupActions.bulkDeletePermissionGroups(ids));
};
