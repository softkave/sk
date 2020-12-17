import { createAsyncThunk } from "@reduxjs/toolkit";
import { IPermissionGroup } from "../../../models/access-control/types";
import AccessControlAPI, {
    IAddPermissionGroupsAPIParams,
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

export const addPermissionGroupsOpAction = createAsyncThunk<
    IOperation | undefined,
    GetOperationActionArgs<IAddPermissionGroupsAPIParams>,
    IAppAsyncThunkConfig
>("op/accessControl/addPermissionGroups", async (arg, thunkAPI) => {
    const opId = arg.opId || getNewId();

    const operation = OperationSelectors.getOperationWithId(
        thunkAPI.getState(),
        opId
    );

    if (isOperationStarted(operation)) {
        return;
    }

    thunkAPI.dispatch(
        dispatchOperationStarted(opId, OperationType.AddPermissionGroups)
    );

    try {
        const isDemoMode = SessionSelectors.isDemoMode(thunkAPI.getState());
        let permissionGroups: IPermissionGroup[] = [];

        if (!isDemoMode) {
            const result = await AccessControlAPI.addPermissionGroups({
                permissionGroups: arg.permissionGroups,
                blockId: arg.blockId,
            });

            if (result.errors) {
                throw result.errors;
            }

            permissionGroups = result.permissionGroups.map(
                (p) => p.permissionGroup
            );
        } else {
        }

        storeNewPermissionGroups(thunkAPI, permissionGroups);
        thunkAPI.dispatch(
            dispatchOperationCompleted(
                opId,
                OperationType.AddPermissionGroups,
                null
            )
        );
    } catch (error) {
        thunkAPI.dispatch(
            dispatchOperationError(
                opId,
                OperationType.AddPermissionGroups,
                error
            )
        );
    }

    return wrapUpOpAction(thunkAPI, opId, arg);
});

export const storeNewPermissionGroups = (
    store: IStoreLikeObject,
    pgs: IPermissionGroup[]
) => {
    store.dispatch(PermissionGroupActions.bulkAddPermissionGroups(pgs));
};
