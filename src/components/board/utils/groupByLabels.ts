import { IBlock, IBlockLabel } from "../../../models/block/block";
import { IBoardGroupedTasks } from "../types";

const NO_LABEL_TEXT = "Unlabeled";

const groupByLabels = (
    labels: IBlockLabel[],
    tasks: IBlock[]
): IBoardGroupedTasks[] => {
    const map: { [key: string]: IBlock[] } = {};
    const noLabel: IBlock[] = [];

    tasks.forEach((task) => {
        const taskLabels = task.labels || [];

        if (taskLabels.length === 0) {
            noLabel.push(task);
            return;
        }

        taskLabels.forEach((label) => {
            const labelTasks = map[label.customId] || [];
            labelTasks.push(task);
            map[label.customId] = labelTasks;
        });
    });

    const groups: IBoardGroupedTasks[] = labels
        .map((s) => {
            return {
                id: s.customId,
                name: s.name,
                color: s.color,
                tasks: map[s.customId] || [],
            };
        })
        .sort((group1, group2) => {
            // sort empty labels to the end
            if (group2.tasks.length === 0) {
                return -1;
            } else if (group1.tasks.length === 0) {
                return 1;
            }

            return 0;
        });

    if (noLabel.length > 0) {
        groups.unshift({
            name: NO_LABEL_TEXT,
            tasks: noLabel,
            id: NO_LABEL_TEXT,
        });
    }

    return groups;
};

export default groupByLabels;
