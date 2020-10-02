import React from "react";
import BoardGroupedTasks, {
    BoardGroupedTasksRenderFn,
} from "./BoardGroupedTasks";
import BoardRenderGroupedTasksDesktop from "./BoardRenderGroupedTasksDesktop";
import { IBoardTasksProps } from "./BoardTasks";
import BoardTasksControls from "./BoardTasksControls";
import { TASK_GROUPS } from "./utils";

const BoardTasksDesktop: React.FC<IBoardTasksProps> = (props) => {
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
                    <BoardRenderGroupedTasksDesktop
                        groups={groups}
                        users={users}
                        board={block}
                        onClickUpdateBlock={onClickUpdateBlock}
                    />
                </React.Fragment>
            );
        },
        [users, block, onClickCreate, onClickUpdateBlock, onSearchTextChange]
    );

    return <BoardGroupedTasks block={block} tasks={tasks} render={render} />;
};

export default BoardTasksDesktop;
