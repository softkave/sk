import * as yup from "yup";
import {
  INewTaskInput,
  ISubTaskInput,
  ITask,
  ITaskAssignedLabelInput,
  ITaskAssigneeInput,
  ITaskSprintInput,
  IUpdateTaskInput,
} from "../../models/task/types";
import { yupObject } from "../../utils/validation";
import { invokeEndpointWithAuth } from "../invokeEndpoint";
import { GetEndpointResult, IEndpointResultBase } from "../types";
import { endpointYupOptions, getComplexTypeSchema } from "../utils";

const baseURL = "/tasks";

export type ICreateTaskEndpointParams = {
  task: INewTaskInput;
};

export type ICreateTaskEndpointResult = GetEndpointResult<{
  task: ITask;
}>;

const assigneeYupSchema = yupObject<ITaskAssigneeInput>({
  userId: yup.string().required(),
});

const subTaskYupSchema = yupObject<ISubTaskInput>({
  description: yup.string().required(),
  customId: yup.string().required(),
  completedBy: yup.string().nullable(),
});

const taskAssignedLabelYupSchema = yupObject<ITaskAssignedLabelInput>({
  labelId: yup.string().required(),
});

const taskSprintYupSchema = yupObject<ITaskSprintInput>({
  sprintId: yup.string().required(),
});

const createTaskYupSchema = yupObject<ICreateTaskEndpointParams>({
  task: yupObject<ICreateTaskEndpointParams["task"]>({
    name: yup.string().required(),
    description: yup.string(),
    boardId: yup.string().required(),
    dueAt: yup.string().nullable(),
    workspaceId: yup.string().required(),
    assignees: yup.array().of(assigneeYupSchema).required(),
    priority: yup.string().nullable(),
    subTasks: yup.array().of(subTaskYupSchema).required(),
    labels: yup.array().of(taskAssignedLabelYupSchema).required(),
    status: yup.string().nullable(),
    taskResolution: yup.string().nullable(),
    taskSprint: taskSprintYupSchema.nullable().default(null),
  }),
});

async function createTask(props: ICreateTaskEndpointParams) {
  return invokeEndpointWithAuth<ICreateTaskEndpointResult>({
    path: `${baseURL}/createTask`,
    data: createTaskYupSchema.validateSync(props, endpointYupOptions),
    apiType: "REST",
  });
}

export interface IUpdateTaskEndpointParams {
  taskId: string;
  data: IUpdateTaskInput;
}

export type IUpdateTaskEndpointResult = GetEndpointResult<{
  task: ITask;
}>;

const updateTaskYupSchema = yupObject<IUpdateTaskEndpointParams>({
  taskId: yup.string().required(),
  data: yupObject<IUpdateTaskEndpointParams["data"]>({
    name: yup.string(),
    description: yup.string().nullable(),
    boardId: yup.string(),
    dueAt: yup.string().nullable(),
    assignees: getComplexTypeSchema(assigneeYupSchema),
    priority: yup.string(),
    subTasks: getComplexTypeSchema(subTaskYupSchema),
    labels: getComplexTypeSchema(taskAssignedLabelYupSchema),
    status: yup.string().nullable(),
    taskResolution: yup.string().nullable(),
    taskSprint: taskSprintYupSchema.nullable().default(undefined),
  }),
});

async function updateTask(props: IUpdateTaskEndpointParams) {
  return await invokeEndpointWithAuth<IUpdateTaskEndpointResult>({
    path: `${baseURL}/updateTask`,
    data: updateTaskYupSchema.validateSync(props, endpointYupOptions),
    apiType: "REST",
  });
}

export interface ITransferTaskEndpointParams {
  taskId: string;
  boardId: string;
}

export type ITransferTaskEndpointResult = GetEndpointResult<{
  task: ITask;
}>;

const transferTaskYupSchema = yupObject<ITransferTaskEndpointParams>({
  taskId: yup.string().required(),
  boardId: yup.string().required(),
});

async function transferTask(props: ITransferTaskEndpointParams) {
  return await invokeEndpointWithAuth<ITransferTaskEndpointResult>({
    path: `${baseURL}/transferTask`,
    data: transferTaskYupSchema.validateSync(props, endpointYupOptions),
    apiType: "REST",
  });
}

export interface IDeleteTaskEndpointParams {
  taskId: string;
}

const deleteTaskYupSchema = yupObject<IDeleteTaskEndpointParams>({
  taskId: yup.string().required(),
});

async function deleteTask(props: IDeleteTaskEndpointParams) {
  return await invokeEndpointWithAuth<IEndpointResultBase>({
    path: `${baseURL}/deleteTask`,
    data: deleteTaskYupSchema.validateSync(props, endpointYupOptions),
    apiType: "REST",
  });
}

export interface IGetBoardTasksEndpointParams {
  boardId: string;
}

export type IGetBoardTasksEndpointResult = GetEndpointResult<{
  tasks: ITask[];
}>;

const getBoardTasksYupSchema = yupObject<IGetBoardTasksEndpointParams>({
  boardId: yup.string().required(),
});

async function getBoardTasks(props: IGetBoardTasksEndpointParams) {
  return await invokeEndpointWithAuth<IGetBoardTasksEndpointResult>({
    path: `${baseURL}/getBoardTasks`,
    data: getBoardTasksYupSchema.validateSync(props, endpointYupOptions),
    apiType: "REST",
  });
}

export interface IGetTaskEndpointParams {
  taskId: string;
}

export type IGetTaskEndpointResult = GetEndpointResult<{
  task: ITask;
}>;

const getTaskYupSchema = yupObject<IGetTaskEndpointParams>({
  taskId: yup.string().required(),
});

async function getTask(props: IGetTaskEndpointParams) {
  return await invokeEndpointWithAuth<IGetTaskEndpointResult>({
    path: `${baseURL}/getTask`,
    data: getTaskYupSchema.validateSync(props, endpointYupOptions),
    apiType: "REST",
  });
}

export default class TaskAPI {
  static createTask = createTask;
  static deleteTask = deleteTask;
  static getBoardTasks = getBoardTasks;
  static transferTask = transferTask;
  static updateTask = updateTask;
  static getTask = getTask;
}
