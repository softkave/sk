import { IBlock } from "../../../models/block/block";
import { ISprint } from "../../../models/sprint/types";
import { IBoardGroupedTasks } from "../types";

const BACKLOG = "Backlog";

const groupBySprints = (
    sprints: ISprint[],
    tasks: IBlock[]
): IBoardGroupedTasks[] => {
    const map: { [key: string]: IBlock[] } = {};
    const backlog: IBlock[] = [];

    tasks.forEach((task) => {
        if (!task.taskSprint) {
            backlog.push(task);
            return;
        }

        const sprintTasks = map[task.taskSprint.sprintId] || [];
        sprintTasks.push(task);
        map[task.taskSprint.sprintId] = sprintTasks;
    });

    const groups: IBoardGroupedTasks[] = sprints.map((s) => {
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
