import { createAsyncThunk } from "@reduxjs/toolkit";
import AccessControlAPI, {
    ISetPermissionsAPIParams,
} from "../../../net/access-control/fns";
import { getNewId, indexArray } from "../../../utils/utils";
import PermissionActions, {
    IUpdatePermissionActionArgs,
} from "../../permissions/actions";
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

export const setPermissionsOpAction = createAsyncThunk<
    IOperation | undefined,
    GetOperationActionArgs<ISetPermissionsAPIParams>,
    IAppAsyncThunkConfig
>("op/accessControl/setPermissions", async (arg, thunkAPI) => {
    const opId = arg.opId || getNewId();

    const operation = OperationSelectors.getOperationWithId(
        thunkAPI.getState(),
        opId
    );

    if (isOperationStarted(operation)) {
        return;
    }

    thunkAPI.dispatch(
        dispatchOperationStarted(opId, OperationType.SetPermissions)
    );

    try {
        const isDemoMode = SessionSelectors.isDemoMode(thunkAPI.getState());
        let data: IUpdatePermissionActionArgs[] = [];

        if (!isDemoMode) {
            const result = await AccessControlAPI.setPermissions({
                blockId: arg.blockId,
                permissions: arg.permissions,
            });

            if (result.errors) {
                throw result.errors;
            }

            const inputMap = indexArray(arg.permissions, { path: "customId" });
            data = result.permissions.map((p) => {
                return {
                    id: p.customId,
                    data: {
                        ...p,
                        ...inputMap[p.customId].data,
                    },
                };
            });
        } else {
        }

        storeSetPermissions(thunkAPI, data);
        thunkAPI.dispatch(
            dispatchOperationCompleted(opId, OperationType.SetPermissions, null)
        );
    } catch (error) {
        thunkAPI.dispatch(
            dispatchOperationError(opId, OperationType.SetPermissions, error)
        );
    }

    return wrapUpOpAction(thunkAPI, opId, arg);
});

export const storeSetPermissions = (
    store: IStoreLikeObject,
    data: IUpdatePermissionActionArgs[]
) => {
    store.dispatch(PermissionActions.bulkUpdatePermissions(data));
};
