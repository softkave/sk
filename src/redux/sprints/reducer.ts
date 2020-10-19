import { createReducer } from "@reduxjs/toolkit";
import SessionActions from "../session/actions";
import {
    reducerAddResources,
    reducerDeleteResources,
    reducerUpdateResources,
} from "../utils";
import SprintActions from "./actions";
import { ISprintsState } from "./types";

const sprintsReducer = createReducer<ISprintsState>({}, (builder) => {
    builder.addCase(SprintActions.addSprint, (state, action) => {
        reducerAddResources(state, [action.payload]);
    });

    builder.addCase(SprintActions.updateSprint, (state, action) => {
        reducerUpdateResources(state, [action.payload]);
    });

    builder.addCase(SprintActions.deleteSprint, (state, action) => {
        reducerDeleteResources(state, [action.payload]);
    });

    builder.addCase(SprintActions.bulkAddSprints, (state, action) => {
        reducerAddResources(state, action.payload);
    });

    builder.addCase(SprintActions.bulkUpdateSprints, (state, action) => {
        reducerUpdateResources(state, action.payload);
    });

    builder.addCase(SprintActions.bulkDeleteSprints, (state, action) => {
        reducerDeleteResources(state, action.payload);
    });

    builder.addCase(SessionActions.logoutUser, () => {
        return {};
    });
});

export default sprintsReducer;
