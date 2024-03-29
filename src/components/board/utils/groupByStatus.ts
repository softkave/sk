import { IBoardStatus } from "../../../models/board/types";
import { sortStatusList } from "../../../models/board/utils";
import { ITask } from "../../../models/task/types";
import { IBoardGroupedTasks } from "../types";

export const NO_STATUS_TEXT = "No status";

const groupByStatus = (status: IBoardStatus[], tasks: ITask[]): IBoardGroupedTasks[] => {
  const map: { [key: string]: ITask[] } = {};
  const noStatus: ITask[] = [];
  tasks.forEach((task) => {
    if (!task.status) {
      noStatus.push(task);
      return;
    }

    const statusTasks = map[task.status] || [];
    statusTasks.push(task);
    map[task.status] = statusTasks;
  });

  const groups: IBoardGroupedTasks[] = sortStatusList(status).map((s) => {
    return {
      id: s.customId,
      name: s.name,
      color: s.color,
      tasks: map[s.customId] || [],
    };
  });

  if (noStatus.length > 0) {
    groups.unshift({
      name: NO_STATUS_TEXT,
      tasks: noStatus,
      id: NO_STATUS_TEXT,
    });
  }

  return groups;
};

export default groupByStatus;
