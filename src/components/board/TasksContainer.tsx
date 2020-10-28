import forEach from "lodash/forEach";
import React from "react";
import { useSelector } from "react-redux";
import { IBlock } from "../../models/block/block";
import { IUser } from "../../models/user/user";
import BlockSelectors from "../../redux/blocks/selectors";
import { IAppState } from "../../redux/types";
import UserSelectors from "../../redux/users/selectors";

export interface ITasksContainerRenderFnProps {
    tasks: IBlock[];
    collaborators: IUser[];
}

export interface ITasksContainerProps {
    board: IBlock;
    useCurrentSprint: boolean;
    searchText?: string;
    render: (props: ITasksContainerRenderFnProps) => React.ReactElement;
}

const TasksContainer: React.FC<ITasksContainerProps> = (props) => {
    const { board, useCurrentSprint, searchText, render } = props;

    const org = useSelector<IAppState, IBlock>((state) => {
        return BlockSelectors.getBlock(
            state,
            board.rootBlockId || board.customId
        )!;
    });

    const collaboratorIds = org.collaborators || [];
    const collaborators = useSelector<IAppState, IUser[]>((state) => {
        return UserSelectors.getUsers(state, collaboratorIds);
    });

    // TODO: how can we memoize previous filters to make search faster
    const tasks = useSelector<IAppState, IBlock[]>((state) => {
        const taskList: IBlock[] = [];

        forEach(state.blocks, (task) => {
            let selectTask = task.parent === board.customId;

            if (selectTask && useCurrentSprint) {
                selectTask =
                    task.taskSprint?.sprintId === board.currentSprintId;
            }

            if (selectTask) {
                taskList.push(task);
            }
        });

        if (!searchText) {
            return taskList;
        }

        const lowerSearchText = searchText.toLowerCase();

        return taskList.filter((task) => {
            return (
                task.name?.toLowerCase().includes(lowerSearchText) ||
                task.description?.toLowerCase().includes(lowerSearchText)
            );
        });
    });

    return render({ tasks, collaborators });
};

export default TasksContainer;
