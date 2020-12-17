import { createReducer } from "@reduxjs/toolkit";
import SessionActions from "../session/actions";
import UserAssignedPermissionGroupActions from "./actions";
import { IUserAssignedPermissionGroupsState } from "./types";

const userAssignedPermissionGroupsReducer = createReducer<IUserAssignedPermissionGroupsState>(
    {},
    (builder) => {
        builder.addCase(
            UserAssignedPermissionGroupActions.addUserAssignedPermissionGroup,
            (state, action) => {
                state[action.payload.customId] = action.payload;
            }
        );

        builder.addCase(
            UserAssignedPermissionGroupActions.deleteUserAssignedPermissionGroup,
            (state, action) => {
                delete state[action.payload];
            }
        );

        builder.addCase(
            UserAssignedPermissionGroupActions.bulkAddUserAssignedPermissionGroups,
            (state, action) => {
                action.payload.forEach(
                    (userAssignedPermissionGroup) =>
                        (state[
                            userAssignedPermissionGroup.customId
                        ] = userAssignedPermissionGroup)
                );
            }
        );

        builder.addCase(
            UserAssignedPermissionGroupActions.bulkDeleteUserAssignedPermissionGroups,
            (state, action) => {
                action.payload.forEach((id) => delete state[id]);
            }
        );

        builder.addCase(SessionActions.logoutUser, (state) => {
            return {};
        });
    }
);

export default userAssignedPermissionGroupsReducer;
