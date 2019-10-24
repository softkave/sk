import { IBlock } from "../../models/block/block";
import {
  bulkAddCollectionItems,
  bulkDeleteCollectionItems,
  bulkUpdateCollectionItems,
  ICollectionMap
} from "../collection";
import { ILogoutUserAction } from "../session/actions";
import { LOGOUT_USER } from "../session/constants";
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

export type IBlocksState = ICollectionMap<IBlock>;

export function blocksReducer(
  state: IBlocksState = {},
  action: IBlocksAction | ILogoutUserAction
): IBlocksState {
  switch (action.type) {
    case ADD_BLOCK: {
      return bulkAddCollectionItems(state, [action.payload]);
    }

    case UPDATE_BLOCK: {
      return bulkUpdateCollectionItems(state, [action.payload], action.meta);
    }

    case DELETE_BLOCK: {
      return bulkDeleteCollectionItems(state, [action.payload]);
    }

    case BULK_ADD_BLOCKS: {
      return bulkAddCollectionItems(state, action.payload);
    }

    case BULK_UPDATE_BLOCKS: {
      return bulkUpdateCollectionItems(state, action.payload, action.meta);
    }

    case BULK_DELETE_BLOCKS: {
      return bulkDeleteCollectionItems(state, action.payload);
    }

    case LOGOUT_USER: {
      return {};
    }

    default:
      return state;
  }
}
