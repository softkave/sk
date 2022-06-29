import * as yup from "yup";
import {
  INewTaskInput,
  ITask,
  IUpdateTaskInput,
} from "../../models/task/types";
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

const assigneeYupSchema = yup.object().shape({
  userId: yup.string().required(),
  // assignedAt: yup.string().required(),
  // assignedBy: yup.string().required(),
});

const subTaskYupSchema = yup.object().shape({
  description: yup.string().required(),
  customId: yup.string().required(),
  completedBy: yup.string(),
  // createdAt: yup.string().required(),
  // createdBy: yup.string().required(),
  // completedAt: yup.string(),
  // updatedAt: yup.string(),
  // updatedBy: yup.string(),
});

const taskAssignedLabelYupSchema = yup.object().shape({
  customId: yup.string().required(),
  // assignedAt: yup.string().required(),
  // assignedBy: yup.string().required(),
});

const taskSprintYupSchema = yup.object().shape({
  sprintId: yup.string().required(),
  // assignedAt: yup.string().required(),
  // assignedBy: yup.string().required(),
});

const createTaskYupSchema = yup.object().shape({
  task: yup.object().shape({
    name: yup.string().required(),
    description: yup.string(),
    parent: yup.string().required(),
    dueAt: yup.string(),
    rootBlockId: yup.string().required(),
    assignees: yup.array().of(assigneeYupSchema).required(),
    priority: yup.string(),
    subTasks: yup.array().of(subTaskYupSchema).required(),
    labels: yup.array().of(taskAssignedLabelYupSchema).required(),
    status: yup.string(),
    // statusAssignedBy: yup.string(),
    // statusAssignedAt: yup.string(),
    taskResolution: yup.string(),
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

const updateTaskYupSchema = yup.object().shape({
  taskId: yup.string().required(),
  data: yup.object().shape({
    name: yup.string(),
    description: yup.string().nullable(),
    parent: yup.string(),
    dueAt: yup.string().nullable(),
    assignees: getComplexTypeSchema(assigneeYupSchema),
    priority: yup.string(),
    subTasks: getComplexTypeSchema(subTaskYupSchema),
    labels: getComplexTypeSchema(taskAssignedLabelYupSchema),
    status: yup.string().nullable(),
    // statusAssignedBy: yup.string().nullable(),
    // statusAssignedAt: yup.string().nullable(),
    taskResolution: yup.string().nullable(),
    taskSprint: taskSprintYupSchema.nullable().default(null),
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

const transferTaskYupSchema = yup.object().shape({
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

const deleteTaskYupSchema = yup.object().shape({
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

const getBoardTasksYupSchema = yup.object().shape({
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

const getTaskYupSchema = yup.object().shape({
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
  public static createTask = createTask;
  public static deleteTask = deleteTask;
  public static getBoardTasks = getBoardTasks;
  public static transferTask = transferTask;
  public static updateTask = updateTask;
  public static getTask = getTask;
}
