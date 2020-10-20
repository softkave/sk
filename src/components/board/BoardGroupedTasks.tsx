import React from "react";
import { IBlock } from "../../models/block/block";
import { IBoardGroupedTasks, TaskGroup } from "./types";
import groupByLabels from "./utils/groupByLabels";
import groupByStatus from "./utils/groupByStatus";

export type BoardGroupedTasksRenderFn = (
    groups: IBoardGroupedTasks[],
    groupType: TaskGroup,
    setGroupType: (type: TaskGroup) => void
) => React.ReactElement;

export interface IBoardGroupedTasksProps {
    block: IBlock;
    tasks: IBlock[];
    render: BoardGroupedTasksRenderFn;
}

const BoardGroupedTasks: React.FC<IBoardGroupedTasksProps> = (props) => {
    const { block, tasks, render } = props;
    const [groupType, setGroupType] = React.useState<TaskGroup>("status");

    switch (groupType) {
        case "status": {
            const groups = groupByStatus(block.boardStatuses || [], tasks);
            return render(groups, groupType, setGroupType);
        }

        case "labels": {
            const groups = groupByLabels(block.boardLabels || [], tasks);
            return render(groups, groupType, setGroupType);
        }

        default:
            return null;
    }
};

export default BoardGroupedTasks;
