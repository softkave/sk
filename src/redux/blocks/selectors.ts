import { IBlock } from "../../models/block/block";
import { isBlockParentOf } from "../../models/block/utils";
import {
  filterCollectionItemsWith,
  getCollectionItemsAsArray
} from "../collection";
import { IReduxState } from "../store";

export function getBlock(state: IReduxState, blockID?: string | null) {
  if (blockID) {
    const blocks = getCollectionItemsAsArray(state.blocks, [blockID]);
    return blocks[0];
  }
}

export function getBlocksAsArray(state: IReduxState, ids: string[]) {
  return getCollectionItemsAsArray(state.blocks, ids);
}

export function getEveryBlockChildrenInState(
  state: IReduxState,
  block: IBlock
) {
  return filterCollectionItemsWith(state.blocks, next =>
    isBlockParentOf(block, next)
  );
}

export function getBlockParents(state: IReduxState, block: IBlock) {
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
