import { IBlock, taskPriority } from "../../models/block/block";

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
