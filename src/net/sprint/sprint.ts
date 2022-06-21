import * as yup from "yup";
import { ISprint, SprintDuration } from "../../models/sprint/types";
import { invokeEndpointWithAuth } from "../invokeEndpoint";
import { GetEndpointResult, IEndpointResultBase } from "../types";
import { endpointYupOptions } from "../utils";

const basePath = "/sprints";
const addSprintPath = `${basePath}/addSprint`;
const deleteSprintPath = `${basePath}/deleteSprint`;
const updateSprintPath = `${basePath}/updateSprint`;
const getSprintsPath = `${basePath}/getSprints`;
const sprintExistsPath = `${basePath}/sprintExists`;

export interface IAddSprintAPIParams {
  boardId: string;
  data: {
    name: string;
    duration: SprintDuration;
  };
}

export type IAddSprintAPIResult = GetEndpointResult<{ sprint: ISprint }>;

const addSprintYupSchema = yup.object().shape({
  boardId: yup.string().required(),
  data: yup.object().shape({
    name: yup.string().required(),
    duration: yup.string().required(),
  }),
});

async function addSprint(
  params: IAddSprintAPIParams
): Promise<IAddSprintAPIResult> {
  return invokeEndpointWithAuth<IAddSprintAPIResult>({
    path: addSprintPath,
    apiType: "REST",
    data: addSprintYupSchema.validateSync(params, endpointYupOptions),
  });
}

async function deleteSprint(sprintId: string): Promise<IEndpointResultBase> {
  return invokeEndpointWithAuth<IEndpointResultBase>({
    path: deleteSprintPath,
    apiType: "REST",
    data: { sprintId },
  });
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

const updateSprintYupSchema = yup.object().shape({
  sprintId: yup.string().required(),
  data: yup.object().shape({
    name: yup.string(),
    duration: yup.string(),
    startDate: yup.string(),
    endDate: yup.string(),
  }),
});

async function updateSprint(
  params: IUpdateSprintAPIParams
): Promise<IUpdateSprintAPIResult> {
  return invokeEndpointWithAuth<IUpdateSprintAPIResult>({
    path: updateSprintPath,
    apiType: "REST",
    data: updateSprintYupSchema.validateSync(params, endpointYupOptions),
  });
}

export type IGetSprintsAPIResult = GetEndpointResult<{ sprints: ISprint[] }>;

async function getSprints(boardId: string): Promise<IGetSprintsAPIResult> {
  return invokeEndpointWithAuth<IGetSprintsAPIResult>({
    path: getSprintsPath,
    apiType: "REST",
    data: { boardId },
  });
}

export interface ISprintExistsAPIParams {
  boardId: string;
  name: string;
}

export type ISprintExistsAPIResult = GetEndpointResult<{ exists: boolean }>;

const sprintExistsYupSchema = yup.object().shape({
  boardId: yup.string().required(),
  name: yup.string().required(),
});

async function sprintExists(
  params: ISprintExistsAPIParams
): Promise<ISprintExistsAPIResult> {
  return invokeEndpointWithAuth<ISprintExistsAPIResult>({
    path: sprintExistsPath,
    apiType: "REST",
    data: sprintExistsYupSchema.validateSync(params, endpointYupOptions),
  });
}

export default class SprintAPI {
  public static addSprint = addSprint;
  public static deleteSprint = deleteSprint;
  public static updateSprint = updateSprint;
  public static getSprints = getSprints;
  public static sprintExists = sprintExists;
}
