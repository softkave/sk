import { BlockType, IBlock } from "../../models/block/block";
import { isBlockParentOf } from "../../models/block/utils";
import {
  filterCollectionItemsWith,
  getCollectionItemsAsArray,
} from "../collection";
import { IAppState } from "../store";

export function getBlock(state: IAppState, blockId?: string | null) {
  if (blockId) {
    const blocks = getCollectionItemsAsArray(state.blocks, [blockId]);
    return blocks[0];
  }
}

export function getBlocksAsArray(state: IAppState, ids: string[]) {
  return getCollectionItemsAsArray(state.blocks, ids);
}

export function getBlockChildren(
  state: IAppState,
  block: IBlock,
  type?: BlockType
) {
  return filterCollectionItemsWith(state.blocks, (next) => {
    if (type && type !== next.type) {
      return false;
    }

    return isBlockParentOf(block, next);
  });
}

export function getBlockParents(state: IAppState, block: IBlock) {
  let b: IBlock = block;
  const parents: IBlock[] = [];

  while (b.type !== "org") {
    // TODO: currently assumes that the parent exists
    const parent = getBlock(state, b.parent!)!;
    parents.unshift(parent);
    b = parent;
  }

  return parents;
}
