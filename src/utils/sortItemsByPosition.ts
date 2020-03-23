import { indexArray } from "./object";

export function sortItemsByPosition(
  items: any[],
  sortIds: string[],
  indexPath: string,
  unknownPlacement: "before" | "after" = "before"
) {
  // TODO: should we sort it in place?
  // if we do, we get O(logN), right now, we get O(N)

  const indexedItems = indexArray(items, { path: indexPath });
  const unknownItems: any[] = [];
  let sortedItems: any[] = [];

  sortIds.forEach(id => {
    if (indexedItems[id]) {
      sortedItems.push(indexedItems[id]);
    } else {
      unknownItems.push(indexedItems[id]);
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
