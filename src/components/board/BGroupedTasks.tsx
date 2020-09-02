import React from "react";
import { IBlock } from "../../models/block/block";
import { IBGroupedTasksGroup, TaskGroup } from "./types";
import toLabelGroups from "./utils/toLabelGroups";
import toStatusGroups from "./utils/toStatusGroups";

export type BGroupedTasksRenderFn = (
    groups: IBGroupedTasksGroup[],
    groupType: TaskGroup,
    setGroupType: (type: TaskGroup) => void
) => React.ReactElement;

export interface IBGroupedTasksProps {
    block: IBlock;
    tasks: IBlock[];
    render: BGroupedTasksRenderFn;
}

const BGroupedTasks: React.FC<IBGroupedTasksProps> = (props) => {
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

export default React.memo(BGroupedTasks);
