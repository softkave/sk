import {
  INewBoardInput,
  IBoard,
  IUpdateBoardInput,
} from "../../models/board/types";
import { invokeEndpointWithAuth } from "../invokeEndpoint";
import {
  GetEndpointResult,
  GetEndpointResultError,
  IEndpointResultBase,
} from "../types";

const baseURL = "/boards";

export type ICreateBoardEndpointParams = {
  board: INewBoardInput;
};

export type ICreateBoardEndpointResult = GetEndpointResult<{
  board: IBoard;
}>;

export type ICreateBoardEndpointResultError =
  GetEndpointResultError<ICreateBoardEndpointParams>;

async function createBoard(props: ICreateBoardEndpointParams) {
  return invokeEndpointWithAuth<ICreateBoardEndpointResult>({
    path: `${baseURL}/createBoard`,
    data: props,
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

async function boardExists(props: IBoardExistsEndpointParams) {
  return await invokeEndpointWithAuth<IBoardExistsEndpointResult>({
    path: `${baseURL}/boardExists`,
    data: props,
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

async function updateBoard(props: IUpdateBoardEndpointParams) {
  return await invokeEndpointWithAuth<IUpdateBoardEndpointResult>({
    path: `${baseURL}/updateBoard`,
    data: props,
    apiType: "REST",
  });
}

export interface IDeleteBoardEndpointParams {
  boardId: string;
}

async function deleteBoard(props: IDeleteBoardEndpointParams) {
  return await invokeEndpointWithAuth<IEndpointResultBase>({
    path: `${baseURL}/deleteBoard`,
    data: props,
    apiType: "REST",
  });
}

export interface IGetOrganizationBoardsEndpointParams {
  organizationId: string;
}

export type IGetOrganizationBoardsEndpointResult = GetEndpointResult<{
  boards: IBoard[];
}>;

async function getOrganizationBoards(
  props: IGetOrganizationBoardsEndpointParams
) {
  return await invokeEndpointWithAuth<IGetOrganizationBoardsEndpointResult>({
    path: `${baseURL}/getOrganizationBoards`,
    data: props,
    apiType: "REST",
  });
}

export interface IGetBoardEndpointParams {
  boardId: string;
}

export type IGetBoardEndpointResult = GetEndpointResult<{
  board: IBoard;
}>;

async function getBoard(props: IGetBoardEndpointParams) {
  return await invokeEndpointWithAuth<IGetBoardEndpointResult>({
    path: `${baseURL}/getBoard`,
    data: props,
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
