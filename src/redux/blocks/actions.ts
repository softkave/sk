import { IBlock } from "../../models/block/block";
import { IReferenceCountedResource } from "../referenceCounting";
import {
  BULK_ADD_BLOCKS,
  BULK_DELETE_BLOCKS,
  BULK_UPDATE_BLOCKS
} from "./constants";

export interface IAddBlockParams {
  id: string;
  block: IBlock;
}

export interface IUpdateBlockParams {
  id: string;
  block: IBlock;
}

export interface IReduxBlock extends IBlock, IReferenceCountedResource {}

export function addBlock(block: IAddBlockParams): IBulkAddBlocksAction {
  return bulkAddBlocks([block]);
}

export function updateBlock(
  block: IUpdateBlockParams
): IBulkUpdateBlocksAction {
  return bulkUpdateBlocks([block]);
}

export function deleteBlock(block: string): IBulkDeleteBlocksAction {
  return bulkDeleteBlocks([block]);
}

export interface IBulkAddBlocksAction {
  type: BULK_ADD_BLOCKS;
  payload: IAddBlockParams[];
}

export function bulkAddBlocks(blocks: IAddBlockParams[]): IBulkAddBlocksAction {
  return {
    type: BULK_ADD_BLOCKS,
    payload: blocks
  };
}

export interface IBulkUpdateBlocksAction {
  type: BULK_UPDATE_BLOCKS;
  payload: IUpdateBlockParams[];
}

export function bulkUpdateBlocks(
  blocks: IUpdateBlockParams[]
): IBulkUpdateBlocksAction {
  return {
    type: BULK_UPDATE_BLOCKS,
    payload: blocks
  };
}

export interface IBulkDeleteBlocksAction {
  type: BULK_DELETE_BLOCKS;
  payload: string[];
}

export function bulkDeleteBlocks(blocks: string[]): IBulkDeleteBlocksAction {
  return {
    type: BULK_DELETE_BLOCKS,
    payload: blocks
  };
}

export type IBlockAction =
  | IBulkAddBlocksAction
  | IBulkUpdateBlocksAction
  | IBulkDeleteBlocksAction;
