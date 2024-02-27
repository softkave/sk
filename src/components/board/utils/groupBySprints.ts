import { IBoardStatus } from "../../../models/board/types";
import { ISprint } from "../../../models/sprint/types";
import { sortSprintByIndex } from "../../../models/sprint/utils";
import { ITask } from "../../../models/task/types";
import { IBoardGroupedTasks } from "../types";

export const BACKLOG = "Backlog";

const groupBySprints = (
  sprints: ISprint[],
  tasks: ITask[],
  statuses: IBoardStatus[]
): IBoardGroupedTasks[] => {
  const completedStatus = statuses[statuses.length - 1];
  const map: { [key: string]: ITask[] } = {};
  const backlog: ITask[] = [];

  tasks.forEach((task) => {
    if (task.taskSprint?.sprintId) {
      const sprintTasks = map[task.taskSprint.sprintId] || [];
      sprintTasks.push(task);
      map[task.taskSprint.sprintId] = sprintTasks;
    } else {
      if (completedStatus && task.status === completedStatus.customId) {
        return;
      }

      backlog.push(task);
    }
  });

  const groups: IBoardGroupedTasks[] = sortSprintByIndex(sprints).map((s) => {
    return {
      id: s.customId,
      name: s.name,
      tasks: map[s.customId] || [],
    };
  });

  if (backlog.length > 0) {
    groups.unshift({
      name: BACKLOG,
      tasks: backlog,
      id: BACKLOG,
    });
  }

  return groups;
};

export default groupBySprints;
