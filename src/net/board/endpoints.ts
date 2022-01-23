import {
  INewBoardInput,
  IBoard,
  IUpdateBoardInput,
} from "../../models/board/types";
import { invokeEndpointWithAuth } from "../invokeEndpoint";
import { GetEndpointResult, IEndpointResultBase } from "../types";

const baseURL = "/api/boards";

export type ICreateBoardEndpointParams = {
  board: INewBoardInput;
};

export type ICreateBoardEndpointResult = GetEndpointResult<{
  board: IBoard;
}>;

async function createBoard(props: ICreateBoardEndpointParams) {
  return invokeEndpointWithAuth<ICreateBoardEndpointResult>({
    path: `${baseURL}/createBoard`,
    data: props,
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
  });
}

export interface IUpdateBoardEndpointParams {
  boardId: string;
  data: IUpdateBoardInput;
}

export type IUpdateBoardEndpointResult = GetEndpointResult<{
  board: IBoard;
}>;

async function updateBoard(props: IUpdateBoardEndpointParams) {
  return await invokeEndpointWithAuth<IUpdateBoardEndpointResult>({
    path: `${baseURL}/updateBoard`,
    data: props,
  });
}

export interface IDeleteBoardEndpointParams {
  boardId: string;
}

async function deleteBoard(props: IDeleteBoardEndpointParams) {
  return await invokeEndpointWithAuth<IEndpointResultBase>({
    path: `${baseURL}/deleteBoard`,
    data: props,
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
