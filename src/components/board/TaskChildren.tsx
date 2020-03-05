import React from "react";
import { IBlock } from "../../models/block/block";
import TaskList from "../task/TaskList";
import BoardBlockChildren from "./LoadBlockChildren";

export interface ITaskChildrenProps {
  block: IBlock;
  onClickUpdateBlock: (block: IBlock) => void;
}

const TaskChildren: React.FC<ITaskChildrenProps> = props => {
  const { block, onClickUpdateBlock } = props;

  const renderTasks = () => {
    return (
      <BoardBlockChildren
        parent={block}
        getChildrenIDs={() => block.tasks || []}
        render={tasks => (
          <TaskList
            tasks={tasks}
            toggleForm={task => onClickUpdateBlock(task)}
          />
        )}
      />
    );
  };

  return renderTasks();
};

export default TaskChildren;
