import * as yup from "yup";
import {
  IBoard,
  IBoardLabelInput,
  IBoardStatusInput,
  IBoardStatusResolutionInput,
  INewBoardInput,
  IUpdateBoardInput,
} from "../../models/board/types";
import { yupObject } from "../../utils/validation";
import { invokeEndpointWithAuth } from "../invokeEndpoint";
import { GetEndpointResult, GetEndpointResultError, IEndpointResultBase } from "../types";
import { endpointYupOptions, getComplexTypeSchema } from "../utils";

const basePath = "/boards";

export interface ICreateBoardEndpointParams {
  board: INewBoardInput;
}

export type ICreateBoardEndpointResult = GetEndpointResult<{
  board: IBoard;
}>;

export type ICreateBoardEndpointResultError = GetEndpointResultError<ICreateBoardEndpointParams>;

const withRequired = (schema: yup.AnySchema<any>, isRequired = true) => {
  return isRequired ? schema.required() : schema;
};

const boardStatusYupSchema = (isNew: boolean) =>
  yupObject<IBoardStatusInput>({
    customId: withRequired(yup.string(), isNew),
    name: withRequired(yup.string(), isNew),
    color: withRequired(yup.string(), isNew),
    position: withRequired(yup.number(), isNew),
    description: yup.string(),
  });

const boardLabelYupSchema = (isNew: boolean) =>
  yupObject<IBoardLabelInput>({
    customId: withRequired(yup.string(), isNew),
    name: withRequired(yup.string(), isNew),
    color: withRequired(yup.string(), isNew),
    description: yup.string(),
  });

const boardResolutionYupSchema = (isNew: boolean) =>
  yupObject<IBoardStatusResolutionInput>({
    customId: withRequired(yup.string(), isNew),
    name: withRequired(yup.string(), isNew),
    description: yup.string(),
  });

const createBoardYupSchema = yupObject<ICreateBoardEndpointParams>({
  board: yupObject<ICreateBoardEndpointParams["board"]>({
    name: yup.string().required(),
    description: yup.string(),
    color: yup.string().required(),
    workspaceId: yup.string().required(),
    boardStatuses: yup.array().of(boardStatusYupSchema(true)).required(),
    boardLabels: yup.array().of(boardLabelYupSchema(true)).required(),
    boardResolutions: yup.array().of(boardResolutionYupSchema(true)).required(),
  }),
});

async function createBoard(props: ICreateBoardEndpointParams) {
  return invokeEndpointWithAuth<ICreateBoardEndpointResult>({
    path: `${basePath}/createBoard`,
    data: createBoardYupSchema.validateSync(props, endpointYupOptions),
    apiType: "REST",
  });
}

export interface IBoardExistsEndpointParams {
  name: string;
  parent: string;
}

export type IBoardExistsEndpointResult = GetEndpointResult<{
  exists: boolean;
}>;

const boardExistsYupSchema = yupObject<IBoardExistsEndpointParams>({
  name: yup.string().required(),
  parent: yup.string().required(),
});

async function boardExists(props: IBoardExistsEndpointParams) {
  return await invokeEndpointWithAuth<IBoardExistsEndpointResult>({
    path: `${basePath}/boardExists`,
    data: boardExistsYupSchema.validateSync(props, endpointYupOptions),
    apiType: "REST",
  });
}

export interface IUpdateBoardEndpointParams {
  boardId: string;
  data: IUpdateBoardInput;
}

export type IUpdateBoardEndpointResult = GetEndpointResult<{
  board: IBoard;
}>;

export type IUpdateBoardEndpointResultError = GetEndpointResultError<IUpdateBoardEndpointParams>;

const updateBoardYupSchema = yupObject<IUpdateBoardEndpointParams>({
  boardId: yup.string().required(),
  data: yupObject<IUpdateBoardEndpointParams["data"]>({
    name: yup.string(),
    description: yup.string(),
    color: yup.string(),
    sprintOptions: yupObject<IUpdateBoardEndpointParams["data"]["sprintOptions"]>({
      duration: yup.string(),
    }),
    boardStatuses: getComplexTypeSchema(boardStatusYupSchema(false)),
    boardLabels: getComplexTypeSchema(boardLabelYupSchema(false)),
    boardResolutions: getComplexTypeSchema(boardResolutionYupSchema(false)),
  }),
});

async function updateBoard(props: IUpdateBoardEndpointParams) {
  return await invokeEndpointWithAuth<IUpdateBoardEndpointResult>({
    path: `${basePath}/updateBoard`,
    data: updateBoardYupSchema.validateSync(props, endpointYupOptions),
    apiType: "REST",
  });
}

export interface IDeleteBoardEndpointParams {
  boardId: string;
}

const deleteBoardYupSchema = yupObject<IDeleteBoardEndpointParams>({
  boardId: yup.string().required(),
});

async function deleteBoard(props: IDeleteBoardEndpointParams) {
  return await invokeEndpointWithAuth<IEndpointResultBase>({
    path: `${basePath}/deleteBoard`,
    data: deleteBoardYupSchema.validateSync(props, endpointYupOptions),
    apiType: "REST",
  });
}

export interface IGetOrganizationBoardsEndpointParams {
  organizationId: string;
}

export type IGetOrganizationBoardsEndpointResult = GetEndpointResult<{
  boards: IBoard[];
}>;

const getOrganizationBoardsYupSchema = yupObject<IGetOrganizationBoardsEndpointParams>({
  organizationId: yup.string().required(),
});

async function getOrganizationBoards(props: IGetOrganizationBoardsEndpointParams) {
  return await invokeEndpointWithAuth<IGetOrganizationBoardsEndpointResult>({
    path: `${basePath}/getOrganizationBoards`,
    data: getOrganizationBoardsYupSchema.validateSync(props, endpointYupOptions),
    apiType: "REST",
  });
}

export interface IGetBoardEndpointParams {
  boardId: string;
}

export type IGetBoardEndpointResult = GetEndpointResult<{
  board: IBoard;
}>;

const getBoardYupSchema = yupObject<IGetBoardEndpointParams>({
  boardId: yup.string().required(),
});

async function getBoard(props: IGetBoardEndpointParams) {
  return await invokeEndpointWithAuth<IGetBoardEndpointResult>({
    path: `${basePath}/getBoard`,
    data: getBoardYupSchema.validateSync(props, endpointYupOptions),
    apiType: "REST",
  });
}

export default class BoardAPI {
  static createBoard = createBoard;
  static boardExists = boardExists;
  static deleteBoard = deleteBoard;
  static getOrganizationBoards = getOrganizationBoards;
  static updateBoard = updateBoard;
  static getBoard = getBoard;
}
