const findItem = <CollectionItemType, ItemType>(
  collection: CollectionItemType[],
  item: ItemType,
  fn: (item1: CollectionItemType, item2: ItemType, index: number) => boolean,
  startIndex = 0
) => {
  for (let i = startIndex; i < collection.length; i++) {
    const nextItem = collection[i];

    if (fn(nextItem, item, i)) {
      return true;
    }
  }

  return false;
};

export default findItem;
