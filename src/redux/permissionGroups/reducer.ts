import { createReducer } from "@reduxjs/toolkit";
import { mergeData } from "../../utils/utils";
import SessionActions from "../session/actions";
import PermissionGroupActions from "./actions";
import { IPermissionGroupsState } from "./types";

const permissionGroupsReducer = createReducer<IPermissionGroupsState>(
    {},
    (builder) => {
        builder.addCase(
            PermissionGroupActions.addPermissionGroup,
            (state, action) => {
                state[action.payload.customId] = action.payload;
            }
        );

        builder.addCase(
            PermissionGroupActions.updatePermissionGroup,
            (state, action) => {
                state[action.payload.id] = mergeData(
                    state[action.payload.id],
                    action.payload.data,
                    action.payload.meta
                );
            }
        );

        builder.addCase(
            PermissionGroupActions.deletePermissionGroup,
            (state, action) => {
                delete state[action.payload];
            }
        );

        builder.addCase(
            PermissionGroupActions.bulkAddPermissionGroups,
            (state, action) => {
                action.payload.forEach(
                    (permissionGroup) =>
                        (state[permissionGroup.customId] = permissionGroup)
                );
            }
        );

        builder.addCase(
            PermissionGroupActions.bulkUpdatePermissionGroups,
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

        builder.addCase(
            PermissionGroupActions.bulkDeletePermissionGroups,
            (state, action) => {
                action.payload.forEach((id) => delete state[id]);
            }
        );

        builder.addCase(SessionActions.logoutUser, (state) => {
            return {};
        });
    }
);

export default permissionGroupsReducer;
