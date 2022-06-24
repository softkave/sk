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

const withRequired = (schema: yup.AnySchema<any>, isRequired = true) => {
  return isRequired ? schema.required() : schema;
};

const assigneeYupSchema = (isNew: boolean) =>
  yup.object().shape({
    userId: withRequired(yup.string(), isNew),
  });

const subTaskYupSchema = (isNew: boolean) =>
  yup.object().shape({
    description: withRequired(yup.string(), isNew),
    completedBy: yup.string().nullable(),
  });

const taskAssignedLabelYupSchema = (isNew: boolean) =>
  yup.object().shape({
    customId: withRequired(yup.string(), isNew),
  });

const taskSprintYupSchema = (isNew: boolean) =>
  yup.object().shape({
    sprintId: withRequired(yup.string(), isNew),
  });

const createTaskYupSchema = yup.object().shape({
  task: yup.object().shape({
    name: yup.string().required(),
    description: yup.string(),
    parent: yup.string().required(),
    dueAt: yup.string(),
    rootBlockId: yup.string().required(),
    assignees: yup.array().of(assigneeYupSchema(true)).required(),
    priority: yup.string(),
    subTasks: yup.array().of(subTaskYupSchema(true)).required(),
    labels: yup.array().of(taskAssignedLabelYupSchema(true)).required(),
    status: yup.string().nullable(),
    taskResolution: yup.string().nullable(),
    taskSprint: taskSprintYupSchema(true).nullable().default(null),
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
    description: yup.string(),
    parent: yup.string(),
    dueAt: yup.string(),
    assignees: getComplexTypeSchema(assigneeYupSchema(false)),
    priority: yup.string(),
    subTasks: getComplexTypeSchema(subTaskYupSchema(false)),
    labels: getComplexTypeSchema(taskAssignedLabelYupSchema(false)),
    status: yup.string().nullable(),
    taskResolution: yup.string().nullable(),
    taskSprint: taskSprintYupSchema(false).nullable().default(null),
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

export default class TaskAPI {
  public static createTask = createTask;
  public static deleteTask = deleteTask;
  public static getBoardTasks = getBoardTasks;
  public static transferTask = transferTask;
  public static updateTask = updateTask;
}
