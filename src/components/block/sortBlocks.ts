import { ITask, TaskPriority } from "../../models/task/types";

const TaskPriorityToNumMap = {
  [TaskPriority.Low]: -1,
  [TaskPriority.High]: 0,
  [TaskPriority.Medium]: 1,
};

export function sortBlocksByPriority(blocks: ITask[] = []) {
  return blocks.sort((blockA, blockB) => {
    const blockAPriorityNum = TaskPriorityToNumMap[blockA.priority!] || 0;
    const blockBPriorityNum = TaskPriorityToNumMap[blockB.priority!] || 0;
    return blockAPriorityNum - blockBPriorityNum;
  });
}
