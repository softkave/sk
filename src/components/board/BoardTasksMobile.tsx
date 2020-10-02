import React from "react";
import BoardGroupedTasks, {
    BoardGroupedTasksRenderFn,
} from "./BoardGroupedTasks";
import BoardRenderGroupedTasksMobile from "./BoardRenderGroupedTasksMobile";
import { IBoardTasksProps } from "./BoardTasks";
import BoardTasksControls from "./BoardTasksControls";
import { TASK_GROUPS } from "./utils";

const BoardTasksMobile: React.FC<IBoardTasksProps> = (props) => {
    const {
        block,
        tasks,
        users,
        onClickUpdateBlock,
        onClickCreate,
        onSearchTextChange,
    } = props;

    const render: BoardGroupedTasksRenderFn = React.useCallback(
        (groups, groupType, setGroupType) => {
            return (
                <React.Fragment>
                    <BoardTasksControls
                        selected={groupType}
                        options={TASK_GROUPS}
                        onClickCreate={onClickCreate}
                        onSearchTextChange={onSearchTextChange}
                        setGroupType={setGroupType}
                    />
                    <BoardRenderGroupedTasksMobile
                        board={block}
                        groups={groups}
                        users={users}
                        onClickUpdateBlock={onClickUpdateBlock}
                    />
                </React.Fragment>
            );
        },
        [users, block, onClickCreate, onClickUpdateBlock, onSearchTextChange]
    );

    return <BoardGroupedTasks block={block} tasks={tasks} render={render} />;
};

export default BoardTasksMobile;
