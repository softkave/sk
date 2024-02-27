import { indexArray } from "../../../utils/utils";
import { SelectedItemsMap } from "./types";

export function toSelectedItemsMap(list: Array<string | undefined | null>): SelectedItemsMap {
  return indexArray(list, { reducer: () => true });
}

export function toSelectedItemsMap02(...list: Array<string | undefined | null>): SelectedItemsMap {
  return indexArray(list, { reducer: () => true });
}
