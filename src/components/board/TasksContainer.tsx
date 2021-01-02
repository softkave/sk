import forEach from "lodash/forEach";
import React from "react";
import { useSelector } from "react-redux";
import {
    IBlock,
    IBlockLabel,
    IBlockStatus,
    IBoardTaskResolution,
} from "../../models/block/block";
import { ISprint } from "../../models/sprint/types";
import { getCurrentAndUpcomingSprints } from "../../models/sprint/utils";
import { IUser } from "../../models/user/user";
import BlockSelectors from "../../redux/blocks/selectors";
import SessionSelectors from "../../redux/session/selectors";
import SprintSelectors from "../../redux/sprints/selectors";
import { IAppState } from "../../redux/types";
import UserSelectors from "../../redux/users/selectors";
import { indexArray } from "../../utils/utils";

export interface ITasksContainerRenderFnProps {
    board: IBlock;
    user: IUser;
    tasks: IBlock[];
    collaborators: IUser[];
    statusList: IBlockStatus[];
    resolutionsList: IBoardTaskResolution[];
    labelList: IBlockLabel[];
    sprints: ISprint[];
    labelsMap: { [key: string]: IBlockLabel };
    sprintsMap: { [key: string]: ISprint };
    statusMap: { [key: string]: IBlockStatus };
    resolutionsMap: { [key: string]: IBoardTaskResolution };
}

export interface ITasksContainerProps {
    board: IBlock;
    useCurrentSprint: boolean;
    searchText?: string;
    render: (props: ITasksContainerRenderFnProps) => React.ReactElement;
}

const TasksContainer: React.FC<ITasksContainerProps> = (props) => {
    const { board, useCurrentSprint, searchText, render } = props;

    const user = useSelector<IAppState, IUser>((state) => {
        return SessionSelectors.assertGetUser(state);
    });

    const org = useSelector<IAppState, IBlock>((state) => {
        return BlockSelectors.getBlock(
            state,
            board.rootBlockId || board.customId
        )!;
    });

    const sprints = useSelector<IAppState, ISprint[]>((state) => {
        const totalSprints = SprintSelectors.getBoardSprints(
            state,
            board.customId
        );

        return getCurrentAndUpcomingSprints(totalSprints);
    });

    const sprintsMap = indexArray(sprints, { path: "customId" });

    const collaboratorIds = org.collaborators || [];
    const collaborators = useSelector<IAppState, IUser[]>((state) => {
        return UserSelectors.getUsers(state, collaboratorIds);
    });

    const statusList = React.useMemo(() => board.boardStatuses || [], [
        board.boardStatuses,
    ]);
    const statusMap = React.useMemo(
        () => indexArray(statusList, { path: "customId" }),
        [statusList]
    );

    const labelList = React.useMemo(() => board.boardLabels || [], [
        board.boardLabels,
    ]);
    const labelsMap = React.useMemo(
        () => indexArray(labelList, { path: "customId" }),
        [labelList]
    );

    const resolutionsList = React.useMemo(() => board.boardResolutions || [], [
        board.boardResolutions,
    ]);
    const resolutionsMap = React.useMemo(
        () => indexArray(resolutionsList, { path: "customId" }),
        [resolutionsList]
    );

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

    return render({
        board,
        user,
        tasks,
        collaborators,
        labelList,
        labelsMap,
        statusList,
        statusMap,
        sprints,
        sprintsMap,
        resolutionsList,
        resolutionsMap,
    });
};

export default TasksContainer;
