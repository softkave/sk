import React from "react";
import { IBlock } from "../../models/block/block";
import { IUser } from "../../models/user/user";
import RenderForDevice from "../RenderForDevice";
import { BoardGroupBy } from "./BoardHeaderOptionsMenu";
import GroupedTasksDesktop from "./GroupedTasksDesktop";
import GroupedTasksMobile from "./GroupedTasksMobile";
import { ITasksContainerRenderFnProps } from "./TasksContainer";
import { IBoardGroupedTasks } from "./types";
import groupByAssignees from "./utils/groupByAssignees";
import groupByLabels from "./utils/groupByLabels";
import groupByStatus from "./utils/groupByStatus";

export interface IGroupedTasksProps extends ITasksContainerRenderFnProps {
    block: IBlock;
    tasks: IBlock[];
    collaborators: IUser[];
    groupType: BoardGroupBy;
    onClickUpdateBlock: (block: IBlock) => void;
}

const GroupedTasks: React.FC<IGroupedTasksProps> = (props) => {
    const { block, tasks, collaborators, groupType } = props;

    let groupedTasks: IBoardGroupedTasks[] = [];

    switch (groupType) {
        case BoardGroupBy.STATUS: {
            groupedTasks = groupByStatus(block.boardStatuses || [], tasks);
            break;
        }

        case BoardGroupBy.LABELS: {
            groupedTasks = groupByLabels(block.boardLabels || [], tasks);
            break;
        }

        case BoardGroupBy.ASSIGNEES: {
            groupedTasks = groupByAssignees(
                collaborators,
                tasks,
                block.boardStatuses || []
            );

            break;
        }
    }

    const renderGroupedTasksDesktop = () => {
        return <GroupedTasksDesktop {...props} groupedTasks={groupedTasks} />;
    };

    const renderGroupedTasksMobile = () => {
        return <GroupedTasksMobile {...props} groupedTasks={groupedTasks} />;
    };

    return (
        <RenderForDevice
            renderForMobile={renderGroupedTasksMobile}
            renderForDesktop={renderGroupedTasksDesktop}
        />
    );
};

export default GroupedTasks;
