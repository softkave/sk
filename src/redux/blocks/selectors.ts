import { BlockType, IBlock } from "../../models/block/block";
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

export function getOrgTasks(state: IAppState, block: IBlock) {
  return filterCollectionItemsWith(state.blocks, (next) => {
    if (BlockType.Task === next.type && block.customId === next.rootBlockId) {
      return true;
    }

    return false;
  });
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

    if (block.customId === next.parent) {
      return true;
    }

    return false;
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
