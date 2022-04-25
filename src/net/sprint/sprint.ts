import { ISprint, SprintDuration } from "../../models/sprint/types";
import auth from "../auth";
import { GetEndpointResult, IEndpointResultBase } from "../types";
import {
  addSprintMutation,
  deleteSprintMutation,
  getSprintsQuery,
  sprintExistsQuery,
  updateSprintMutation,
} from "./schema";

export interface IAddSprintAPIParams {
  boardId: string;
  data: {
    name: string;
    duration: SprintDuration;
  };
}

export type IAddSprintAPIResult = GetEndpointResult<{ sprint: ISprint }>;

async function addSprint(
  params: IAddSprintAPIParams
): Promise<IAddSprintAPIResult> {
  return auth(null, addSprintMutation, params, "data.sprint.addSprint");
}

async function deleteSprint(sprintId: string): Promise<IEndpointResultBase> {
  return auth(
    null,
    deleteSprintMutation,
    { sprintId },
    "data.sprint.deleteSprint"
  );
}

export interface IUpdateSprintAPIParams {
  sprintId: string;
  data: {
    name?: string;
    duration?: SprintDuration;
    startDate?: string;
    endDate?: string;
  };
}

export type IUpdateSprintAPIResult = GetEndpointResult<{
  sprint: ISprint;
}>;

async function updateSprint(
  params: IUpdateSprintAPIParams
): Promise<IUpdateSprintAPIResult> {
  return auth(null, updateSprintMutation, params, "data.sprint.updateSprint");
}

export type IGetSprintsAPIResult = GetEndpointResult<{ sprints: ISprint[] }>;

async function getSprints(boardId: string): Promise<IGetSprintsAPIResult> {
  return auth(null, getSprintsQuery, { boardId }, "data.sprint.getSprints");
}

export interface ISprintExistsAPIParams {
  boardId: string;
  name: string;
}

export type ISprintExistsAPIResult = GetEndpointResult<{ exists: boolean }>;

async function sprintExists(
  params: ISprintExistsAPIParams
): Promise<ISprintExistsAPIResult> {
  return auth(null, sprintExistsQuery, params, "data.sprint.sprintExists");
}

export default class SprintAPI {
  public static addSprint = addSprint;
  public static deleteSprint = deleteSprint;
  public static updateSprint = updateSprint;
  public static getSprints = getSprints;
  public static sprintExists = sprintExists;
}
