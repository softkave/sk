import { createAsyncThunk } from "@reduxjs/toolkit";
import { IPermissionGroup } from "../../../models/access-control/types";
import { IBlock, IFormBlock } from "../../../models/block/block";
import AccessControlAPI, {
    IUpdatePermissionGroupsAPIParams,
    IUpdatePermissionGroupsPermissionGroupInput,
} from "../../../net/access-control/fns";
import { getNewId, indexArray } from "../../../utils/utils";
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

export const updatePermissionGroupsOpAction = createAsyncThunk<
    IOperation | undefined,
    GetOperationActionArgs<IUpdatePermissionGroupsAPIParams>,
    IAppAsyncThunkConfig
>("op/accessControl/updatePermissionGroups", async (arg, thunkAPI) => {
    const opId = arg.opId || getNewId();

    const operation = OperationSelectors.getOperationWithId(
        thunkAPI.getState(),
        opId
    );

    if (isOperationStarted(operation)) {
        return;
    }

    thunkAPI.dispatch(
        dispatchOperationStarted(opId, OperationType.UpdatePermissionGroups)
    );

    try {
        const isDemoMode = SessionSelectors.isDemoMode(thunkAPI.getState());
        let data: (IUpdatePermissionGroupsPermissionGroupInput &
            Partial<IPermissionGroup>)[] = [];

        if (!isDemoMode) {
            const result = await AccessControlAPI.updatePermissionGroups({
                blockId: arg.blockId,
                permissionGroups: arg.permissionGroups,
            });

            if (result.errors) {
                throw result.errors;
            }

            const inputMap = indexArray(arg.permissionGroups, {
                path: "customId",
            });

            data = result.permissionGroups.map((p) => {
                return {
                    ...p,
                    ...inputMap[p.customId].data,
                };
            });
        } else {
        }

        storeUpdatePermissionGroups(thunkAPI, data);
        thunkAPI.dispatch(
            dispatchOperationCompleted(
                opId,
                OperationType.UpdatePermissionGroups,
                null
            )
        );
    } catch (error) {
        thunkAPI.dispatch(
            dispatchOperationError(
                opId,
                OperationType.UpdatePermissionGroups,
                error
            )
        );
    }

    return wrapUpOpAction(thunkAPI, opId, arg);
});

export const storeUpdatePermissionGroups = (
    store: IStoreLikeObject,
    data: (IUpdatePermissionGroupsPermissionGroupInput &
        Partial<IPermissionGroup>)[]
) => {};
