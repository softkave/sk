import React from "react";
import { IBlock } from "../../models/block/block";
import { IBoardGroupedTasksGroup, TaskGroup } from "./types";
import toLabelGroups from "./utils/toLabelGroups";
import toStatusGroups from "./utils/toStatusGroups";

export type BoardGroupedTasksRenderFn = (
    groups: IBoardGroupedTasksGroup[],
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
            const groups = toStatusGroups(block.boardStatuses || [], tasks);
            return render(groups, groupType, setGroupType);
        }

        case "labels": {
            const groups = toLabelGroups(block.boardLabels || [], tasks);

            return render(groups, groupType, setGroupType);
        }

        default:
            return null;
    }
};

export default BoardGroupedTasks;
