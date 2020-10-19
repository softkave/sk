import { createAction } from "@reduxjs/toolkit";
import { ISprint } from "../../models/sprint/types";
import { IMergeDataMeta } from "../../utils/utils";

const addSprint = createAction<ISprint>("sprints/addSprint");

export interface IUpdateSprintActionArgs {
    id: string;
    data: Partial<ISprint>;
    meta?: IMergeDataMeta;
}

const updateSprint = createAction<IUpdateSprintActionArgs>(
    "sprints/updateSprint"
);

const deleteSprint = createAction<string>("sprints/deleteSprint");

const bulkAddSprints = createAction<ISprint[]>("sprints/bulkAddSprints");

const bulkUpdateSprints = createAction<IUpdateSprintActionArgs[]>(
    "sprints/bulkUpdateSprints"
);

const bulkDeleteSprints = createAction<string[]>("sprints/bulkDeleteSprints");

class SprintActions {
    public static addSprint = addSprint;
    public static updateSprint = updateSprint;
    public static deleteSprint = deleteSprint;
    public static bulkAddSprints = bulkAddSprints;
    public static bulkUpdateSprints = bulkUpdateSprints;
    public static bulkDeleteSprints = bulkDeleteSprints;
}

export default SprintActions;
