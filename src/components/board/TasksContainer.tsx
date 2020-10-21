import forEach from "lodash/forEach";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { BlockType, IBlock } from "../../models/block/block";
import { IUser } from "../../models/user/user";
import BlockSelectors from "../../redux/blocks/selectors";
import { loadBlockChildrenOpAction } from "../../redux/operations/block/loadBlockChildren";
import OperationType from "../../redux/operations/OperationType";
import { AppDispatch, IAppState } from "../../redux/types";
import UserSelectors from "../../redux/users/selectors";
import GeneralErrorList from "../GeneralErrorList";
import useOperation, { IUseOperationStatus } from "../hooks/useOperation";
import LoadingEllipsis from "../utilities/LoadingEllipsis";
import { BoardGroupBy } from "./BoardHeaderOptionsMenu";
import GroupedTasks from "./GroupedTasks";

export interface ITasksContainerProps {
    block: IBlock;
    useCurrentSprint: boolean;
    groupType: BoardGroupBy;
    searchText?: string;
    onClickUpdateBlock: (block: IBlock) => void;
}

const TasksContainer: React.FC<ITasksContainerProps> = (props) => {
    const {
        block,
        useCurrentSprint,
        searchText,
        groupType,
        onClickUpdateBlock,
    } = props;

    const dispatch: AppDispatch = useDispatch();

    const loadTasks = (loadProps: IUseOperationStatus) => {
        const shouldLoad = !loadProps.operation;

        if (shouldLoad) {
            dispatch(
                loadBlockChildrenOpAction({
                    block,
                    typeList: [BlockType.Task],
                    opId: loadProps.opId,
                })
            );
        }
    };

    const op = useOperation(
        {
            resourceId: block.customId,
            type: OperationType.LOAD_BLOCK_CHILDREN,
        },
        loadTasks,
        { deleteManagedOperationOnUnmount: false }
    );

    const org = useSelector<IAppState, IBlock>((state) => {
        return BlockSelectors.getBlock(
            state,
            block.rootBlockId || block.customId
        )!;
    });

    const collaboratorIds = org.collaborators || [];
    const collaborators = useSelector<IAppState, IUser[]>((state) => {
        if (!op.isCompleted) {
            return [];
        }

        return UserSelectors.getUsers(state, collaboratorIds);
    });

    // TODO: how can we memoize previous filters to make search faster
    const tasks = useSelector<IAppState, IBlock[]>((state) => {
        if (!op.isCompleted) {
            return [];
        }

        const taskList: IBlock[] = [];

        forEach(state.blocks, (task) => {
            const selectTask =
                task.parent === block.customId &&
                (useCurrentSprint
                    ? task.currentSprintId === block.currentSprintId
                    : true);

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

    const isLoadingChildren = op.isLoading || !op.operation;

    if (isLoadingChildren) {
        return <LoadingEllipsis />;
    } else if (op && op.error) {
        return <GeneralErrorList fill errors={[op.error]} />;
    }

    return (
        <GroupedTasks
            block={block}
            collaborators={collaborators}
            groupType={groupType}
            tasks={tasks}
            onClickUpdateBlock={onClickUpdateBlock}
        />
    );
};

export default TasksContainer;
