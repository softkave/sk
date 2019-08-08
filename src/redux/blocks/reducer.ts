// TODO: Remove unused node modules

import { IBlock } from "../../models/block/block";
import {
  bulkAddReferenceCountedResources,
  bulkDeleteReferenceCountedResources,
  bulkUpdateReferenceCountedResources,
  IReferenceCountedResourceContainer
} from "../referenceCounting";
import { IBlocksActions } from "./actions";
import {
  BULK_ADD_BLOCKS,
  BULK_DELETE_BLOCKS,
  BULK_UPDATE_BLOCKS
} from "./constants";

export interface IBlocksReduxState {
  [key: string]: IReferenceCountedResourceContainer<IBlock>;
}

export function blocksReducer(
  state: IBlocksReduxState,
  action: IBlocksActions
) {
  switch (action.type) {
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
