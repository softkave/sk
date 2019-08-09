import { getResourcesAsArray } from "../referenceCounting";
import { IReduxState } from "../store";

export function getBlock(state: IReduxState, blockID: string) {
  const blocks = getResourcesAsArray(state.blocks, [blockID]);
  return blocks[0];
}

export function getBlocksAsArray(state: IReduxState, ids: string[]) {
  return getResourcesAsArray(state.blocks, ids);
}
