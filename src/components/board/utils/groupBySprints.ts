import { IBlock, IBlockStatus } from "../../../models/block/block";
import { ISprint } from "../../../models/sprint/types";
import { sortSprintByIndex } from "../../../models/sprint/utils";
import { IBoardGroupedTasks } from "../types";

export const BACKLOG = "Backlog";

const groupBySprints = (
    sprints: ISprint[],
    tasks: IBlock[],
    statuses: IBlockStatus[]
): IBoardGroupedTasks[] => {
    const completedStatus = statuses[statuses.length - 1];
    const map: { [key: string]: IBlock[] } = {};
    const backlog: IBlock[] = [];

    tasks.forEach((task) => {
        if (!task.taskSprint?.sprintId) {
            if (completedStatus && task.status === completedStatus.customId) {
                return;
            }

            backlog.push(task);
            return;
        }

        const sprintTasks = map[task.taskSprint.sprintId] || [];
        sprintTasks.push(task);
        map[task.taskSprint.sprintId] = sprintTasks;
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
