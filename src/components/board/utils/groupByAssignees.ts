import { IBlock, IBlockStatus } from "../../../models/block/block";
import { IUser } from "../../../models/user/user";
import { indexArray } from "../../../utils/utils";
import { IBoardGroupedTasks } from "../types";

export const NO_ASSIGNEES_TEXT = "Unassigned";

const groupByAssignees = (
    assignees: IUser[],
    tasks: IBlock[],
    statuses: IBlockStatus[]
): IBoardGroupedTasks[] => {
    const map: { [key: string]: IBlock[] } = {};
    const noAssignees: IBlock[] = [];

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
            name: assignee.name,
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

    function getTaskStatusIndex(task: IBlock) {
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
