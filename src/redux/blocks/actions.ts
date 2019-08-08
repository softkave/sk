import { IBlock } from "../../models/block/block";
import { makeReferenceCountedResourceActions } from "../referenceCounting";
import {
  BULK_ADD_BLOCKS,
  BULK_DELETE_BLOCKS,
  BULK_UPDATE_BLOCKS
} from "./constants";

const actions = makeReferenceCountedResourceActions<
  IBlock,
  BULK_ADD_BLOCKS,
  BULK_UPDATE_BLOCKS,
  BULK_DELETE_BLOCKS
>(BULK_ADD_BLOCKS, BULK_UPDATE_BLOCKS, BULK_DELETE_BLOCKS);

export const addBlock = actions.addResource;
export const updateBlock = actions.updateResource;
export const deleteBlock = actions.deleteResource;
export const bulkAddBlocks = actions.bulkAddResources;
export const bulkUpdateBlocks = actions.bulkUpdateResources;
export const bulkDeleteBlocks = actions.bulkDeleteResources;

export type IBlocksActions = typeof actions.actionTypes;
