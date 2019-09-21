import { getCollectionItemsAsArray } from "../collection";
import { IReduxState } from "../store";

export function getBlock(state: IReduxState, blockID: string) {
  const blocks = getCollectionItemsAsArray(state.blocks, [blockID]);
  return blocks[0];
}

export function getBlocksAsArray(state: IReduxState, ids: string[]) {
  return getCollectionItemsAsArray(state.blocks, ids);
}
