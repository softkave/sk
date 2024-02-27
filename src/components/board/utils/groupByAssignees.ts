import { IBoardStatus } from "../../../models/board/types";
import { ICollaborator } from "../../../models/collaborator/types";
import { ITask } from "../../../models/task/types";
import { getUserFullName } from "../../../models/user/utils";
import { indexArray } from "../../../utils/utils";
import { IBoardGroupedTasks } from "../types";

export const NO_ASSIGNEES_TEXT = "Unassigned";

const groupByAssignees = (
  assignees: ICollaborator[],
  tasks: ITask[],
  statuses: IBoardStatus[]
): IBoardGroupedTasks[] => {
  const map: { [key: string]: ITask[] } = {};
  const noAssignees: ITask[] = [];

  tasks.forEach((task) => {
    const taskAssignees = task.assignees || [];

    if (taskAssignees.length === 0) {
      noAssignees.push(task);
      return;
    }

    taskAssignees.forEach((assignee) => {
      const assigneeTasks = map[assignee.userId] || [];
      assigneeTasks.push(task);
      map[assignee.userId] = assigneeTasks;
    });
  });

  const groups: IBoardGroupedTasks[] = assignees.map((assignee) => {
    return {
      id: assignee.customId,
      name: getUserFullName(assignee),
      color: assignee.color,
      tasks: map[assignee.customId] || [],
    };
  });

  if (noAssignees.length > 0) {
    groups.unshift({
      name: NO_ASSIGNEES_TEXT,
      tasks: noAssignees,
      id: NO_ASSIGNEES_TEXT,
    });
  }

  const statusMap = indexArray(statuses, {
    path: "customId",
    reducer: (a, b, index) => index,
  });

  function getTaskStatusIndex(task: ITask) {
    if (!task.status) {
      return -1;
    }

    return statusMap[task.status];
  }

  groups.forEach((group) => {
    group.tasks.sort((task1, task2) => {
      const task1StatusIndex = getTaskStatusIndex(task1);
      const task2StatusIndex = getTaskStatusIndex(task2);

      if (task1StatusIndex < task2StatusIndex) {
        return -1;
      } else if (task1StatusIndex > task2StatusIndex) {
        return 1;
      } else {
        return 0;
      }
    });
  });

  return groups;
};

export default groupByAssignees;
