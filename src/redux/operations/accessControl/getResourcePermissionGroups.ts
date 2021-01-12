import { createAsyncThunk } from "@reduxjs/toolkit";
import { IPermissionGroup } from "../../../models/access-control/types";
import AccessControlAPI, {
    IGetResourcePermissionGroupsAPIParams,
} from "../../../net/access-control/fns";
import { getNewId } from "../../../utils/utils";
import PermissionGroupActions from "../../permissionGroups/actions";
import SessionSelectors from "../../session/selectors";
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

export const getResourcePermissionGroupsOpAction = createAsyncThunk<
    IOperation | undefined,
    GetOperationActionArgs<IGetResourcePermissionGroupsAPIParams>,
    IAppAsyncThunkConfig
>("op/accessControl/getResourcePermissionGroups", async (arg, thunkAPI) => {
    const opId = arg.opId || getNewId();

    const operation = OperationSelectors.getOperationWithId(
        thunkAPI.getState(),
        opId
    );

    if (isOperationStarted(operation)) {
        return;
    }

    thunkAPI.dispatch(
        dispatchOperationStarted(
            opId,
            OperationType.GetResourcePermissionGroups
        )
    );

    try {
        const isDemoMode = SessionSelectors.isDemoMode(thunkAPI.getState());
        let permissionGroups: IPermissionGroup[] = [];

        if (!isDemoMode) {
            const result = await AccessControlAPI.getResourcePermissionGroups({
                blockId: arg.blockId,
            });

            if (result.errors) {
                throw result.errors;
            }

            permissionGroups = result.permissionGroups;
        } else {
        }

        // thunkAPI.dispatch(
        //     PermissionGroupActions.bulkAddPermissionGroups(permissionGroups)
        // );

        thunkAPI.dispatch(
            dispatchOperationCompleted(
                opId,
                OperationType.GetResourcePermissionGroups,
                null
            )
        );
    } catch (error) {
        thunkAPI.dispatch(
            dispatchOperationError(
                opId,
                OperationType.GetResourcePermissionGroups,
                error
            )
        );
    }

    return wrapUpOpAction(thunkAPI, opId, arg);
});
