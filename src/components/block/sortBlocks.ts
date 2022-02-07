import { BlockPriority } from "../../models/block/block";
import { ITask } from "../../models/task/types";

const blockPriorityToNumMap = {
  [BlockPriority.Low]: -1,
  [BlockPriority.High]: 0,
  [BlockPriority.Medium]: 1,
};

export function sortBlocksByPriority(blocks: ITask[] = []) {
  return blocks.sort((blockA, blockB) => {
    const blockAPriorityNum = blockPriorityToNumMap[blockA.priority!] || 0;
    const blockBPriorityNum = blockPriorityToNumMap[blockB.priority!] || 0;
    return blockAPriorityNum - blockBPriorityNum;
  });
}
