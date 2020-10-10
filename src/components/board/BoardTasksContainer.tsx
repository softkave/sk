import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { BlockType, IBlock } from "../../models/block/block";
import { IUser } from "../../models/user/user";
import BlockSelectors from "../../redux/blocks/selectors";
import { loadBlockChildrenOperationAction } from "../../redux/operations/block/loadBlockChildren";
import OperationType from "../../redux/operations/OperationType";
import { AppDispatch, IAppState } from "../../redux/types";
import UserSelectors from "../../redux/users/selectors";
import GeneralErrorList from "../GeneralErrorList";
import useOperation, { IUseOperationStatus } from "../hooks/useOperation";
import TaskFormInDrawer from "../task/TaskFormInDrawer";
import LoadingEllipsis from "../utilities/LoadingEllipsis";
import BoardTasks from "./BoardTasks";

export interface IBoardTasksContainerProps {
    block: IBlock;
}

interface IShowTaskForm {
    isNew: boolean;
    task?: IBlock;
}

function useLoadStatus(block: IBlock) {
    const dispatch: AppDispatch = useDispatch();

    const loadTasks = (loadProps: IUseOperationStatus) => {
        const shouldLoad = !loadProps.operation;

        if (shouldLoad) {
            dispatch(
                loadBlockChildrenOperationAction({
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
            type: OperationType.LoadBlockChildren,
        },
        loadTasks,
        { deleteManagedOperationOnUnmount: false }
    );

    return op;
}

function useComponentData(
    op: IUseOperationStatus,
    block: IBlock,
    searchText: string
) {
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

        const blockList: IBlock[] = [];
        Object.keys(state.blocks).forEach((id) => {
            const task = state.blocks[id];

            if (
                task.type === BlockType.Task &&
                task.parent === block.customId
            ) {
                blockList.push(task);
            }
        });

        if (!searchText) {
            return blockList;
        }

        const lowerSearchText = searchText.toLowerCase();
        return blockList.filter((task) => {
            return (
                task.name?.toLowerCase().includes(lowerSearchText) ||
                task.description?.toLowerCase().includes(lowerSearchText)
            );
        });
    });

    return { org, tasks, collaborators };
}

const BoardTasksContainer: React.FC<IBoardTasksContainerProps> = (props) => {
    const { block } = props;
    const [showTask, setShowTask] = React.useState<IShowTaskForm | null>(null);
    const [searchText, setSearchText] = React.useState<string>("");

    const op = useLoadStatus(block);
    const { org, tasks, collaborators } = useComponentData(
        op,
        block,
        searchText
    );

    const closeTaskForm = React.useCallback(() => {
        setShowTask(null);
    }, []);

    const renderTaskForm = () => {
        if (showTask) {
            return (
                <TaskFormInDrawer
                    visible
                    block={showTask.task}
                    onClose={closeTaskForm}
                    orgId={org.customId}
                    parentBlock={block}
                />
            );
        }

        return null;
    };

    const onClickCreateTask = React.useCallback(() => {
        setShowTask({ isNew: true });
    }, []);

    const onClickUpdateTask = React.useCallback((task: IBlock) => {
        setShowTask({ task, isNew: false });
    }, []);

    const isLoadingChildren = op.isLoading || !!!op.operation;

    if (isLoadingChildren) {
        return <LoadingEllipsis />;
    } else if (op && op.error) {
        return <GeneralErrorList fill errors={[op.error]} />;
    }

    return (
        <React.Fragment>
            {renderTaskForm()}
            <BoardTasks
                block={block}
                tasks={tasks}
                users={collaborators}
                onClickCreate={onClickCreateTask}
                onClickUpdateBlock={onClickUpdateTask}
                onSearchTextChange={setSearchText}
            />
        </React.Fragment>
    );
};

export default BoardTasksContainer;
