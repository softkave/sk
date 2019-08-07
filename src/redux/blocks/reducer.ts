// TODO: Remove unused node modules

import merge from "lodash/merge";

import { bulkAddReferenceCountedResource } from "../referenceCounting";
import { IBlockAction, IReduxBlock } from "./actions";
import {
  BULK_ADD_BLOCKS,
  BULK_DELETE_BLOCKS,
  BULK_UPDATE_BLOCKS
} from "./constants";

export interface IBlocksReduxState {
  [key: string]: IReduxBlock;
}

export function blocksReducer(state: IBlocksReduxState, action: IBlockAction) {
  switch (action.type) {
    case BULK_ADD_BLOCKS: {
      return bulkAddReferenceCountedResource<IReduxBlock>(
        state,
        action.payload
      );
    }

    case BULK_UPDATE_BLOCKS: {
      if (action.payload.length === 0) {
        return state;
      }

      const updatedState = { ...state };

      action.payload.forEach(block => {
        let reduxBlock = updatedState[block.id];

        if (reduxBlock) {
          reduxBlock = merge({}, updatedState[block.id], block.block);
          updatedState[block.id] = reduxBlock;
        }
      });

      return updatedState;
    }

    case BULK_DELETE_BLOCKS: {
      if (action.payload.length === 0) {
        return state;
      }

      const updatedState = { ...state };

      action.payload.forEach(id => {
        let reduxBlock = updatedState[id];

        if (reduxBlock) {
          if (reduxBlock.referenceCount > 1) {
            reduxBlock = merge({}, updatedState[id]);
            reduxBlock.referenceCount -= 1;
            updatedState[id] = reduxBlock;
          } else {
            delete updatedState[id];
          }
        }
      });

      return updatedState;
    }

    default:
      return state;
  }
}
