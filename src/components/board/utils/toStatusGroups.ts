import { IBlock, IBlockStatus } from "../../../models/block/block";
import { IBGroupedTasksGroup } from "../types";
import { NO_STATUS } from "../utils";

const toStatusGroups = (
    status: IBlockStatus[],
    tasks: IBlock[]
): IBGroupedTasksGroup[] => {
    const map: { [key: string]: IBlock[] } = {};
    const noStatus: IBlock[] = [];
    console.log({ status, tasks });

    tasks.forEach((task) => {
        if (!task.status) {
            noStatus.push(task);
            return;
        }

        const statusTasks = map[task.status] || [];
        statusTasks.push(task);
        map[task.status] = statusTasks;
    });

    console.log({ map });

    const groups: IBGroupedTasksGroup[] = status.map((s) => {
        return {
            name: s.name,
            color: s.color,
            tasks: map[s.customId] || [],
        };
    });

    console.log({ groups });

    if (noStatus.length > 0) {
        groups.unshift({ name: NO_STATUS, tasks: noStatus });
    }

    return groups;
};

export default toStatusGroups;
