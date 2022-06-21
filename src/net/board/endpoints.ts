import * as yup from "yup";
import {
  IBoard,
  INewBoardInput,
  IUpdateBoardInput,
} from "../../models/board/types";
import { invokeEndpointWithAuth } from "../invokeEndpoint";
import {
  GetEndpointResult,
  GetEndpointResultError,
  IEndpointResultBase,
} from "../types";
import { endpointYupOptions, getComplexTypeSchema } from "../utils";

const basePath = "/boards";

export type ICreateBoardEndpointParams = {
  board: INewBoardInput;
};

export type ICreateBoardEndpointResult = GetEndpointResult<{
  board: IBoard;
}>;

export type ICreateBoardEndpointResultError =
  GetEndpointResultError<ICreateBoardEndpointParams>;

const withRequired = (schema: yup.AnySchema<any>, isRequired = true) => {
  return isRequired ? schema.required() : schema;
};

const boardStatusYupSchema = (isNew: boolean) =>
  yup.object().shape({
    customId: withRequired(yup.string(), isNew),
    name: withRequired(yup.string(), isNew),
    color: withRequired(yup.string(), isNew),
    position: withRequired(yup.number(), isNew),
    description: yup.string(),
  });

const boardLabelYupSchema = (isNew: boolean) =>
  yup.object().shape({
    customId: withRequired(yup.string(), isNew),
    name: withRequired(yup.string(), isNew),
    color: withRequired(yup.string(), isNew),
    description: yup.string(),
  });

const boardResolutionYupSchema = (isNew: boolean) =>
  yup.object().shape({
    customId: withRequired(yup.string(), isNew),
    name: withRequired(yup.string(), isNew),
    description: yup.string(),
  });

const createBoardYupSchema = yup.object().shape({
  board: yup.object().shape({
    name: yup.string().required(),
    description: yup.string(),
    color: yup.string().required(),
    parent: yup.string().required(),
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

const boardExistsYupSchema = yup.object().shape({
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

export type IUpdateBoardEndpointResultError =
  GetEndpointResultError<IUpdateBoardEndpointParams>;

const updateBoardYupSchema = yup.object().shape({
  boardId: yup.string().required(),
  data: yup.object().shape({
    name: yup.string(),
    description: yup.string(),
    color: yup.string(),
    sprintOptions: yup.object().shape({ duration: yup.string() }),
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

const deleteBoardYupSchema = yup.object().shape({
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

const getOrganizationBoardsYupSchema = yup.object().shape({
  organizationId: yup.string().required(),
});

async function getOrganizationBoards(
  props: IGetOrganizationBoardsEndpointParams
) {
  return await invokeEndpointWithAuth<IGetOrganizationBoardsEndpointResult>({
    path: `${basePath}/getOrganizationBoards`,
    data: getOrganizationBoardsYupSchema.validateSync(
      props,
      endpointYupOptions
    ),
    apiType: "REST",
  });
}

export interface IGetBoardEndpointParams {
  boardId: string;
}

export type IGetBoardEndpointResult = GetEndpointResult<{
  board: IBoard;
}>;

const getBoardYupSchema = yup.object().shape({
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
  public static createBoard = createBoard;
  public static boardExists = boardExists;
  public static deleteBoard = deleteBoard;
  public static getOrganizationBoards = getOrganizationBoards;
  public static updateBoard = updateBoard;
  public static getBoard = getBoard;
}
