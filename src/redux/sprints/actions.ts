import { createAction } from "@reduxjs/toolkit";
import { ISprint } from "../../models/sprint/types";
import { IMergeDataMeta } from "../../utils/utils";

const addSprint = createAction<ISprint>("sprints/addSprint");

export interface IUpdateSprintActionArgs {
  id: string;
  data: Partial<ISprint>;
  meta?: IMergeDataMeta;
}

const updateSprint = createAction<IUpdateSprintActionArgs>("sprints/updateSprint");

const deleteSprint = createAction<string>("sprints/deleteSprint");

const bulkAddSprints = createAction<ISprint[]>("sprints/bulkAddSprints");

const bulkUpdateSprints = createAction<IUpdateSprintActionArgs[]>("sprints/bulkUpdateSprints");

const bulkDeleteSprints = createAction<string[]>("sprints/bulkDeleteSprints");

class SprintActions {
  static addSprint = addSprint;
  static updateSprint = updateSprint;
  static deleteSprint = deleteSprint;
  static bulkAddSprints = bulkAddSprints;
  static bulkUpdateSprints = bulkUpdateSprints;
  static bulkDeleteSprints = bulkDeleteSprints;
}

export default SprintActions;
