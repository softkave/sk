import {
    INewTaskInput,
    ITask,
    IUpdateTaskInput,
} from "../../models/task/types";
import { invokeEndpointWithAuth } from "../invokeEndpoint";
import { GetEndpointResult, IEndpointResultBase } from "../types";

const baseURL = "/api/tasks";

export type ICreateTaskEndpointParams = {
    task: INewTaskInput;
};

export type ICreateTaskEndpointResult = GetEndpointResult<{
    task: ITask;
}>;

async function createTask(props: ICreateTaskEndpointParams) {
    return invokeEndpointWithAuth<ICreateTaskEndpointResult>({
        path: `${baseURL}/createTask`,
        data: props,
    });
}

export interface IUpdateTaskEndpointParams {
    taskId: string;
    data: IUpdateTaskInput;
}

export type IUpdateTaskEndpointResult = GetEndpointResult<{
    task: ITask;
}>;

async function updateTask(props: IUpdateTaskEndpointParams) {
    return await invokeEndpointWithAuth<IUpdateTaskEndpointResult>({
        path: `${baseURL}/updateTask`,
        data: props,
    });
}

export interface ITransferTaskEndpointParams {
    taskId: string;
    boardId: string;
}

export type ITransferTaskEndpointResult = GetEndpointResult<{
    task: ITask;
}>;

async function transferTask(props: ITransferTaskEndpointParams) {
    return await invokeEndpointWithAuth<ITransferTaskEndpointResult>({
        path: `${baseURL}/transferTask`,
        data: props,
    });
}

export interface IDeleteTaskEndpointParams {
    taskId: string;
}

async function deleteTask(props: IDeleteTaskEndpointParams) {
    return await invokeEndpointWithAuth<IEndpointResultBase>({
        path: `${baseURL}/deleteTask`,
        data: props,
    });
}

export interface IGetBoardTasksEndpointParams {
    boardId: string;
}

export type IGetBoardTasksEndpointResult = GetEndpointResult<{
    tasks: ITask[];
}>;

async function getBoardTasks(props: IGetBoardTasksEndpointParams) {
    return await invokeEndpointWithAuth<IGetBoardTasksEndpointResult>({
        path: `${baseURL}/getBoardTasks`,
        data: props,
    });
}

export default class TaskAPI {
    public static createTask = createTask;
    public static deleteTask = deleteTask;
    public static getBoardTasks = getBoardTasks;
    public static transferTask = transferTask;
    public static updateTask = updateTask;
}
