import { IUpdateItemById } from "../utils/types";
import { indexArray } from "../utils/utils";

export function getComplexFieldInput<T1 extends object, T0 extends T1>(
    arr: T0[],
    data: T1[],
    indexPath: T1 extends object ? keyof T1 : never,
    reducer: (data: T1 | T0) => T1 | T0,
    check: (d0: T0, d1: T1) => boolean
) {
    const add: T1[] = [];
    const remove: string[] = [];
    const update: Array<IUpdateItemById<T1>> = [];
    const existingItemsMap = indexArray(arr, {
        reducer,
        path: indexPath,
    });

    const dataMap = indexArray(data, { reducer, path: indexPath });

    data.forEach((item) => {
        const existingItem = existingItemsMap[item[indexPath] as any];

        if (!existingItem) {
            add.push(item);
        } else {
            if (check(existingItem as T0, item)) {
                update.push({
                    id: item[indexPath] as any,
                    data: item,
                });
            }
        }
    });

    arr.forEach((item) => {
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
