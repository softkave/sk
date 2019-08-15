import { IBlock } from "../../models/block/block";
import {
  bulkAddReferenceCountedResources,
  bulkDeleteReferenceCountedResources,
  bulkUpdateReferenceCountedResources,
  IReferenceCountedNormalizedResources
} from "../referenceCounting";
import { IBlocksAction } from "./actions";
import {
  ADD_BLOCK,
  BULK_ADD_BLOCKS,
  BULK_DELETE_BLOCKS,
  BULK_UPDATE_BLOCKS,
  DELETE_BLOCK,
  UPDATE_BLOCK
} from "./constants";

// TODO: Remove unused node modules

export type IBlocksState = IReferenceCountedNormalizedResources<IBlock>;

export function blocksReducer(
  state: IBlocksState = {},
  action: IBlocksAction
): IBlocksState {
  switch (action.type) {
    case ADD_BLOCK: {
      return bulkAddReferenceCountedResources(state, [action.payload]);
    }

    case UPDATE_BLOCK: {
      return bulkUpdateReferenceCountedResources(state, [action.payload]);
    }

    case DELETE_BLOCK: {
      return bulkDeleteReferenceCountedResources(state, [action.payload]);
    }

    case BULK_ADD_BLOCKS: {
      return bulkAddReferenceCountedResources(state, action.payload);
    }

    case BULK_UPDATE_BLOCKS: {
      return bulkUpdateReferenceCountedResources(state, action.payload);
    }

    case BULK_DELETE_BLOCKS: {
      return bulkDeleteReferenceCountedResources(state, action.payload);
    }

    default:
      return state;
  }
}
