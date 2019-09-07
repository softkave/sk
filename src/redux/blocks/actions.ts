import { IBlock } from "../../models/block/block";
import { IClearStateAction } from "../actions";
import {
  IReferenceCountedResourceAddPayload,
  IReferenceCountedResourceDeletePayload,
  IReferenceCountedResourceUpdatePayload,
  IUpdateResourceMeta
} from "../referenceCounting";
import {
  ADD_BLOCK,
  BULK_ADD_BLOCKS,
  BULK_DELETE_BLOCKS,
  BULK_UPDATE_BLOCKS,
  DELETE_BLOCK,
  UPDATE_BLOCK
} from "./constants";

export interface IAddBlockAction {
  type: ADD_BLOCK;
  payload: IReferenceCountedResourceAddPayload<IBlock>;
}

export function addBlockRedux(block: IBlock): IAddBlockAction {
  return {
    type: ADD_BLOCK,
    payload: {
      id: block.customId,
      data: block
    }
  };
}

export interface IUpdateBlockAction {
  type: UPDATE_BLOCK;
  payload: IReferenceCountedResourceUpdatePayload<IBlock>;
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
      data: block
    }
  };
}

export interface IDeleteBlockAction {
  type: DELETE_BLOCK;
  payload: IReferenceCountedResourceDeletePayload;
}

export function deleteBlockRedux(id: string): IDeleteBlockAction {
  return {
    type: DELETE_BLOCK,
    payload: {
      id
    }
  };
}

export interface IBulkAddBlocksAction {
  type: BULK_ADD_BLOCKS;
  payload: Array<IReferenceCountedResourceAddPayload<IBlock>>;
}

export function bulkAddBlocksRedux(blocks: IBlock[]): IBulkAddBlocksAction {
  return {
    type: BULK_ADD_BLOCKS,
    payload: blocks.map(block => ({
      id: block.customId,
      data: block
    }))
  };
}

export interface IBulkUpdateBlocksAction {
  type: BULK_UPDATE_BLOCKS;
  payload: Array<IReferenceCountedResourceUpdatePayload<IBlock>>;
  meta: IUpdateResourceMeta;
}

export function bulkUpdateBlocksRedux(
  blocks: Array<{ id: string; data: Partial<IBlock> }>,
  meta: IUpdateResourceMeta
): IBulkUpdateBlocksAction {
  return {
    meta,
    type: BULK_UPDATE_BLOCKS,
    payload: blocks
  };
}

export interface IBulkDeleteBlocksAction {
  type: BULK_DELETE_BLOCKS;
  payload: IReferenceCountedResourceDeletePayload[];
}

export function bulkDeleteBlocksRedux(
  blocks: string[]
): IBulkDeleteBlocksAction {
  return {
    type: BULK_DELETE_BLOCKS,
    payload: blocks.map(id => ({ id }))
  };
}

export type IBlocksAction =
  | IClearStateAction
  | IAddBlockAction
  | IUpdateBlockAction
  | IDeleteBlockAction
  | IBulkAddBlocksAction
  | IBulkUpdateBlocksAction
  | IBulkDeleteBlocksAction;
