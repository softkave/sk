// TODO: Remove unused node modules

import { IBlock } from "../../models/block/block";
import { makeReferenceCountedResourcesReducer } from "../referenceCounting";
import {
  BULK_ADD_BLOCKS,
  BULK_DELETE_BLOCKS,
  BULK_UPDATE_BLOCKS
} from "./constants";

const reducer = makeReferenceCountedResourcesReducer<
  IBlock,
  BULK_ADD_BLOCKS,
  BULK_UPDATE_BLOCKS,
  BULK_DELETE_BLOCKS
>(BULK_ADD_BLOCKS, BULK_UPDATE_BLOCKS, BULK_DELETE_BLOCKS);

export const blocksReducer = reducer.reducer;

export type IBlocksReduxState = typeof reducer.resourcesType;
