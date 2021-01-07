import { createAsyncThunk } from "@reduxjs/toolkit";
import { IPermission } from "../../../models/access-control/types";
import { IBlock, IFormBlock } from "../../../models/block/block";
import AccessControlAPI, {
    IGetResourcePermissionsAPIParams,
} from "../../../net/access-control/fns";
import { getNewId } from "../../../utils/utils";
import PermissionActions from "../../permissions/actions";
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

export const getResourcePermissionsOpAction = createAsyncThunk<
    IOperation | undefined,
    GetOperationActionArgs<IGetResourcePermissionsAPIParams>,
    IAppAsyncThunkConfig
>("op/accessControl/getResourcePermissions", async (arg, thunkAPI) => {
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
        let permissions: IPermission[] = [];

        if (!isDemoMode) {
            const result = await AccessControlAPI.getResourcePermissions({
                blockId: arg.blockId,
            });

            if (result.errors) {
                throw result.errors;
            }

            permissions = result.permissions;
        } else {
        }

        thunkAPI.dispatch(PermissionActions.bulkAddPermissions(permissions));

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
