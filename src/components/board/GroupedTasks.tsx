import React from "react";
import { IBlock } from "../../models/block/block";
import { IUser } from "../../models/user/user";
import RenderForDevice from "../RenderForDevice";
import { BoardGroupBy } from "./BoardHeaderOptionsMenu";
import GroupedTasksDesktop from "./GroupedTasksDesktop";
import GroupedTasksMobile from "./GroupedTasksMobile";
import { IBoardGroupedTasks } from "./types";
import groupByAssignees from "./utils/groupByAssignees";
import groupByLabels from "./utils/groupByLabels";
import groupByStatus from "./utils/groupByStatus";

export interface IGroupedTasksProps {
    block: IBlock;
    tasks: IBlock[];
    collaborators: IUser[];
    groupType: BoardGroupBy;
    onClickUpdateBlock: (block: IBlock) => void;
}

const GroupedTasks: React.FC<IGroupedTasksProps> = (props) => {
    const {
        block,
        tasks,
        collaborators,
        groupType,
        onClickUpdateBlock,
    } = props;

    let groupedTasks: IBoardGroupedTasks[] = [];

    switch (groupType) {
        case BoardGroupBy.STATUS: {
            groupedTasks = groupByStatus(block.boardStatuses || [], tasks);
        }

        case BoardGroupBy.LABELS: {
            groupedTasks = groupByLabels(block.boardLabels || [], tasks);
        }

        case BoardGroupBy.ASSIGNEES: {
            groupedTasks = groupByAssignees(
                collaborators,
                tasks,
                block.boardStatuses || []
            );
        }
    }

    const renderGroupedTasksDesktop = () => {
        return (
            <GroupedTasksDesktop
                board={block}
                groupedTasks={groupedTasks}
                users={collaborators}
                onClickUpdateBlock={onClickUpdateBlock}
            />
        );
    };

    const renderGroupedTasksMobile = () => {
        return (
            <GroupedTasksMobile
                board={block}
                groupedTasks={groupedTasks}
                users={collaborators}
                onClickUpdateBlock={onClickUpdateBlock}
            />
        );
    };

    return (
        <RenderForDevice
            renderForMobile={renderGroupedTasksMobile}
            renderForDesktop={renderGroupedTasksDesktop}
        />
    );
};

export default GroupedTasks;
