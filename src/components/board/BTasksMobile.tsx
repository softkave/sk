import React from "react";
import BGroupedTasks, { BGroupedTasksRenderFn } from "./BGroupedTasks";
import BRenderGroupedTasksMobile from "./BRenderGroupedTasksMobile";
import { IBTasksProps } from "./BTasks";
import BTasksControls from "./BTasksControls";
import { TASK_GROUPS } from "./utils";

const BTasksMobile: React.FC<IBTasksProps> = (props) => {
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
                    <BRenderGroupedTasksMobile
                        groups={groups}
                        users={users}
                        onClickUpdateBlock={onClickUpdateBlock}
                    />
                </React.Fragment>
            );
        },
        [users, onClickCreate, onClickUpdateBlock, onSearchTextChange]
    );

    return <BGroupedTasks block={block} tasks={tasks} render={render} />;
};

export default React.memo(BTasksMobile);
