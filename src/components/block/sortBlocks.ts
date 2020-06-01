import { BlockPriority, IBlock } from "../../models/block/block";

const blockPriorityToNumMap = {
  [BlockPriority.VeryImportant]: -1,
  [BlockPriority.Important]: 0,
  [BlockPriority.NotImportant]: 1,
};

export function sortBlocksByPriority(blocks: IBlock[] = []) {
  return blocks.sort((blockA, blockB) => {
    const blockAPriorityNum = blockPriorityToNumMap[blockA.priority!] || 0;
    const blockBPriorityNum = blockPriorityToNumMap[blockB.priority!] || 0;

    return blockAPriorityNum - blockBPriorityNum;
  });
}
