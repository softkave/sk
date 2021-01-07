import { createAsyncThunk } from "@reduxjs/toolkit";
import { IUserAssignedPermissionGroup } from "../../../models/access-control/types";
import { IBlock, IFormBlock } from "../../../models/block/block";
import AccessControlAPI from "../../../net/access-control/fns";
import { getNewId } from "../../../utils/utils";
import SessionSelectors from "../../session/selectors";
import { IAppAsyncThunkConfig, IStoreLikeObject } from "../../types";
import UserAssignedPermissionGroupActions from "../../userAssignedPermissionGroups/actions";
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
import { GetOperationActionArgs, IOperationActionBaseArgs } from "../types";

export const getUserPermissionsOpAction = createAsyncThunk<
    IOperation | undefined,
    IOperationActionBaseArgs,
    IAppAsyncThunkConfig
>("op/accessControl/getUserPermissions", async (arg, thunkAPI) => {
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
        let uapgs: IUserAssignedPermissionGroup[] = [];

        if (!isDemoMode) {
            const result = await AccessControlAPI.getUserPermissions();

            if (result.errors) {
                throw result.errors;
            }

            uapgs = result.permissionGroups;
        } else {
        }

        thunkAPI.dispatch(
            UserAssignedPermissionGroupActions.bulkAddUserAssignedPermissionGroups(
                uapgs
            )
        );

        thunkAPI.dispatch(
            dispatchOperationCompleted(opId, OperationType.AddBlock, null)
        );
    } catch (error) {
        thunkAPI.dispatch(
            dispatchOperationError(opId, OperationType.AddBlock, error)
        );
    }

    return wrapUpOpAction(thunkAPI, opId, arg);
});
