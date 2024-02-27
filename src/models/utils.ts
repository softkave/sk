import { indexArray } from "../utils/utils";

export function getComplexFieldInput<T extends object>(
  arr: T[],
  data: T[],
  indexPath: T extends object ? keyof T : never,
  reducer: (data: T | T) => T | T,
  check: (d0: T, d1: T) => boolean,
  extract: (d: T | T) => T
) {
  const add: T[] = [];
  const remove: string[] = [];
  const update: T[] = [];
  const existingItemsMap = indexArray(arr || [], {
    reducer,
    path: indexPath,
  });

  const dataMap = indexArray(data || [], { reducer, path: indexPath });
  (data || []).forEach((item) => {
    const key = item[indexPath] as any;
    const existingItem = existingItemsMap[key];

    if (!existingItem) {
      add.push(extract(item));
    } else {
      if (check(existingItem as T, item)) {
        update.push(extract(item));
      }
    }
  });

  (arr || []).forEach((item) => {
    if (!dataMap[item[indexPath] as any]) {
      remove.push(item[indexPath] as any);
    }
  });

  return {
    add: add.length > 0 ? add : undefined,
    remove: remove.length > 0 ? remove : undefined,
    update: update.length > 0 ? update : undefined,
  };
}

export function getNameInitials(name: string) {
  const nameSplit = name.split(" ");
  const initials = nameSplit
    .slice(0, 3)
    .map((name) => name[0])
    .join("");
  return initials.toUpperCase();
}
