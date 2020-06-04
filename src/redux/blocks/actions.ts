import { IBlock } from "../../models/block/block";
import {
  ICollectionAddItemPayload,
  ICollectionDeleteItemPayload,
  ICollectionUpdateItemPayload,
  IUpdateResourceMeta,
} from "../collection";
import {
  ADD_BLOCK,
  BULK_ADD_BLOCKS,
  BULK_DELETE_BLOCKS,
  BULK_UPDATE_BLOCKS,
  DELETE_BLOCK,
  UPDATE_BLOCK,
} from "./constants";

export interface IAddBlockAction {
  type: ADD_BLOCK;
  payload: ICollectionAddItemPayload<IBlock>;
}

export function addBlockRedux(block: IBlock): IAddBlockAction {
  return {
    type: ADD_BLOCK,
    payload: {
      id: block.customId,
      data: block,
    },
  };
}

export interface IUpdateBlockAction {
  type: UPDATE_BLOCK;
  payload: ICollectionUpdateItemPayload<IBlock>;
  meta: IUpdateResourceMeta;
}

export function updateBlockRedux(
  id: string,
  block: Partial<IBlock>,
  meta: IUpdateResourceMeta
): IUpdateBlockAction {
  return {
    meta,
    type: UPDATE_BLOCK,
    payload: {
      id,
      data: block,
    },
  };
}

export interface IdeleteBlockAction {
  type: DELETE_BLOCK;
  payload: ICollectionDeleteItemPayload;
}

export function deleteBlockRedux(id: string): IdeleteBlockAction {
  return {
    type: DELETE_BLOCK,
    payload: {
      id,
    },
  };
}

export interface IBulkAddBlocksAction {
  type: BULK_ADD_BLOCKS;
  payload: Array<ICollectionAddItemPayload<IBlock>>;
}

export function bulkAddBlocksRedux(blocks: IBlock[]): IBulkAddBlocksAction {
  return {
    type: BULK_ADD_BLOCKS,
    payload: blocks.map((block) => ({
      id: block.customId,
      data: block,
    })),
  };
}

export interface IBulkUpdateBlocksAction {
  type: BULK_UPDATE_BLOCKS;
  payload: Array<ICollectionUpdateItemPayload<IBlock>>;
  meta: IUpdateResourceMeta;
}

export function bulkUpdateBlocksRedux(
  blocks: Array<{ id: string; data: Partial<IBlock> }>,
  meta: IUpdateResourceMeta
): IBulkUpdateBlocksAction {
  return {
    meta,
    type: BULK_UPDATE_BLOCKS,
    payload: blocks,
  };
}

export interface IBulkDeleteBlocksAction {
  type: BULK_DELETE_BLOCKS;
  payload: ICollectionDeleteItemPayload[];
}

export function bulkDeleteBlocksRedux(
  blocks: string[]
): IBulkDeleteBlocksAction {
  return {
    type: BULK_DELETE_BLOCKS,
    payload: blocks.map((id) => ({ id })),
  };
}

export type IBlocksAction =
  | IAddBlockAction
  | IUpdateBlockAction
  | IdeleteBlockAction
  | IBulkAddBlocksAction
  | IBulkUpdateBlocksAction
  | IBulkDeleteBlocksAction;
