import { IBlock } from "../../models/block/block";
import { indexArray } from "../../utils/object";

// TODO: Define types
export function sortBlocksByPosition(
  blocks: IBlock[] = [],
  sortIds: string[] = []
) {
  const indexedBlocks = indexArray(blocks, { path: "customId" });
  const sortedBlocks: IBlock[] = [];
  sortIds.forEach(id => {
    if (indexedBlocks[id]) {
      sortedBlocks.push(indexedBlocks[id]);
    }
  });

  return sortedBlocks;
}

const blockPriorityToNumMap = {
  "very important": -1,
  important: 0,
  "not important": 1
};

export function sortBlocksByPriority(blocks: IBlock[] = []) {
  return blocks.sort((blockA, blockB) => {
    const blockAPriorityNum = blockPriorityToNumMap[blockA.priority];
    const blockBPriorityNum = blockPriorityToNumMap[blockB.priority];

    return blockAPriorityNum - blockBPriorityNum;
  });
}

// TODO: Implement
export function sortBlocksByExpirationDate(blocks: IBlock[]) {}
