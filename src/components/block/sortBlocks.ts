import { IBlock, taskPriority } from "../../models/block/block";
import { indexArray } from "../../utils/object";

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
  [taskPriority["very important"]]: -1,
  important: 0,
  [taskPriority["not important"]]: 1
};

export function sortBlocksByPriority(blocks: IBlock[] = []) {
  return blocks.sort((blockA, blockB) => {
    const blockAPriorityNum = blockPriorityToNumMap[blockA.priority!] || 0;
    const blockBPriorityNum = blockPriorityToNumMap[blockB.priority!] || 0;

    return blockAPriorityNum - blockBPriorityNum;
  });
}

// TODO: Implement
export function sortBlocksByExpirationDate(blocks: IBlock[]) {}
