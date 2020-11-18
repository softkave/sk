import { ISprint, SprintDuration } from "../../models/sprint/types";
import auth from "../auth";
import { GetEndpointResult, IEndpointResultBase } from "../types";
import {
    addSprintMutation,
    deleteSprintMutation,
    endSprintMutation,
    getSprintsQuery,
    setupSprintMutation,
    sprintExistsQuery,
    startSprintMutation,
    updateSprintMutation,
    updateSprintOptionsMutation,
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

export type IStartSprintAPIResult = GetEndpointResult<{
    startDate: string;
}>;

async function startSprint(sprintId: string): Promise<IStartSprintAPIResult> {
    return auth(
        null,
        startSprintMutation,
        { sprintId },
        "data.sprint.startSprint"
    );
}

export type IEndSprintAPIResult = GetEndpointResult<{
    endDate: string;
}>;

async function endSprint(sprintId: string): Promise<IEndSprintAPIResult> {
    return auth(null, endSprintMutation, { sprintId }, "data.sprint.endSprint");
}

export interface ISetupSprintsAPIParams {
    boardId: string;
    data: {
        duration: SprintDuration;
    };
}

export type ISetupSprintsResult = GetEndpointResult<{
    createdAt: string;
}>;

async function setupSprint(
    params: ISetupSprintsAPIParams
): Promise<ISetupSprintsResult> {
    return auth(null, setupSprintMutation, params, "data.sprint.setupSprints");
}

export interface IUpdateSprintAPIParams {
    sprintId: string;
    data: {
        name?: string;
        duration?: SprintDuration;
    };
}

export type IUpdateSprintAPIResult = GetEndpointResult<{
    updatedAt: string;
}>;

async function updateSprint(
    params: IUpdateSprintAPIParams
): Promise<IUpdateSprintAPIResult> {
    return auth(null, updateSprintMutation, params, "data.sprint.updateSprint");
}

export interface IUpdateSprintOptionsAPIParams {
    boardId: string;
    data: {
        duration: SprintDuration;
    };
}

export type IUpdateSprintOptionsAPIResult = GetEndpointResult<{
    updatedAt: string;
}>;

async function updateSprintOptions(
    params: IUpdateSprintOptionsAPIParams
): Promise<IUpdateSprintOptionsAPIResult> {
    return auth(
        null,
        updateSprintOptionsMutation,
        params,
        "data.sprint.updateSprintOptions"
    );
}

export type IGetSprintsAPIResult = GetEndpointResult<ISprint[]>;

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
    public static startSprint = startSprint;
    public static endSprint = endSprint;
    public static setupSprint = setupSprint;
    public static updateSprint = updateSprint;
    public static updateSprintOptions = updateSprintOptions;
    public static getSprints = getSprints;
    public static sprintExists = sprintExists;
}
