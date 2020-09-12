import React from "react";
import BGroupedTasks, { BGroupedTasksRenderFn } from "./BGroupedTasks";
import BRenderGroupedTasksDesktop from "./BRenderGroupedTasksDesktop";
import { IBTasksProps } from "./BTasks";
import BTasksControls from "./BTasksControls";
import { TASK_GROUPS } from "./utils";

const BTasksDesktop: React.FC<IBTasksProps> = (props) => {
    const {
        block,
        tasks,
        users,
        onClickUpdateBlock,
        onClickCreate,
        onSearchTextChange,
    } = props;

    const render: BGroupedTasksRenderFn = React.useCallback(
        (groups, groupType, setGroupType) => {
            return (
                <React.Fragment>
                    <BTasksControls
                        selected={groupType}
                        options={TASK_GROUPS}
                        onClickCreate={onClickCreate}
                        onSearchTextChange={onSearchTextChange}
                        setGroupType={setGroupType}
                    />
                    <BRenderGroupedTasksDesktop
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

    return <BGroupedTasks block={block} tasks={tasks} render={render} />;
};

export default React.memo(BTasksDesktop);
