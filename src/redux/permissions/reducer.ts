import { createReducer } from "@reduxjs/toolkit";
import { mergeData } from "../../utils/utils";
import SessionActions from "../session/actions";
import PermissionActions from "./actions";
import { IPermissionsState } from "./types";

const permissionsReducer = createReducer<IPermissionsState>({}, (builder) => {
    builder.addCase(PermissionActions.updatePermission, (state, action) => {
        state[action.payload.id] = mergeData(
            state[action.payload.id],
            action.payload.data,
            action.payload.meta
        );
    });

    builder.addCase(PermissionActions.bulkAddPermissions, (state, action) => {
        action.payload.forEach(
            (permission) => (state[permission.customId] = permission)
        );
    });

    builder.addCase(
        PermissionActions.bulkUpdatePermissions,
        (state, action) => {
            action.payload.forEach((param) => {
                state[param.id] = mergeData(
                    state[param.id],
                    param.data,
                    param.meta
                );
            });
        }
    );

    builder.addCase(SessionActions.logoutUser, (state) => {
        return {};
    });
});

export default permissionsReducer;
