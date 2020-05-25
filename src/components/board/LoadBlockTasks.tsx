import React from "react";
import { IBlock } from "../../models/block/block";
import TaskList from "../task/TaskList";
import LoadBlockChildren from "./LoadBlockChildren";

export interface ILoadBlockTasksProps {
  block: IBlock;
  onClickUpdateBlock: (block: IBlock) => void;
}

const LoadBlockTasks: React.FC<ILoadBlockTasksProps> = (props) => {
  const { block, onClickUpdateBlock } = props;

  const renderTasks = () => {
    return (
      <LoadBlockChildren
        parent={block}
        getChildrenIDs={() => block.tasks || []}
        render={(tasks) => (
          <TaskList
            tasks={tasks}
            toggleForm={(task) => onClickUpdateBlock(task)}
          />
        )}
      />
    );
  };

  return renderTasks();
};

export default React.memo(LoadBlockTasks);
