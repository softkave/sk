import { indexArray } from "./object";

export function sortItemsByPosition(
  items: any[],
  sortIds: string[],
  getIndex: (item: any, index: number) => string,
  unknownPlacement: "before" | "after" = "before"
) {
  // TODO: should we sort it in place?
  // if we do, we get O(logN), right now, we get O(N)

  const indexedIds = indexArray(sortIds, {
    proccessValue: (id, existingItem, path, index) => index,
  });
  const unknownItems: any[] = [];
  let sortedItems: any[] = [];

  items.forEach((item, i) => {
    const key = getIndex(item, i);

    if (indexedIds[key] >= 0) {
      sortedItems.splice(indexedIds[key], 0, item);
    } else {
      unknownItems.push(item);
    }
  });

  if (unknownItems.length > 0) {
    if (unknownPlacement === "before") {
      sortedItems = unknownItems.concat(sortedItems);
    } else {
      sortedItems = sortedItems.concat(unknownItems);
    }
  }

  return sortedItems;
}
