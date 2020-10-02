import { IBlock, IBlockStatus } from "../../../models/block/block";
import { IBoardGroupedTasksGroup } from "../types";
import { NO_STATUS } from "../utils";

const toStatusGroups = (
    status: IBlockStatus[],
    tasks: IBlock[]
): IBoardGroupedTasksGroup[] => {
    const map: { [key: string]: IBlock[] } = {};
    const noStatus: IBlock[] = [];

    tasks.forEach((task) => {
        if (!task.status) {
            noStatus.push(task);
            return;
        }

        const statusTasks = map[task.status] || [];
        statusTasks.push(task);
        map[task.status] = statusTasks;
    });

    const groups: IBoardGroupedTasksGroup[] = status.map((s) => {
        return {
            id: s.customId,
            name: s.name,
            color: s.color,
            tasks: map[s.customId] || [],
        };
    });

    if (noStatus.length > 0) {
        groups.unshift({ name: NO_STATUS, tasks: noStatus, id: NO_STATUS });
    }

    return groups;
};

export default toStatusGroups;
