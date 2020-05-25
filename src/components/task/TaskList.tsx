import React from "react";
import { IBlock } from "../../models/block/block";
import { sortBlocksByPriority } from "../block/sortBlocks";
import StyledContainer from "../styled/Container";
import List from "../styled/List";
import Task from "./Task";

export interface ITaskListProps {
  tasks: IBlock[];
  toggleForm?: (block: IBlock) => void;
}

const TaskList: React.FC<ITaskListProps> = (props) => {
  const { toggleForm, tasks } = props;
  const tasksToRender = sortBlocksByPriority(tasks);
  const renderTask = (task: IBlock, i: number) => {
    const isNotLastTask = i < tasksToRender.length - 1;

    return (
      <StyledContainer
        key={task.customId}
        style={{
          borderBottom: isNotLastTask ? "1px solid #f0f0f0" : undefined,
          paddingBottom: "32px",
          paddingTop: "32px",
        }}
      >
        <Task
          task={task}
          onEdit={
            toggleForm ? (editedTask) => toggleForm(editedTask) : undefined
          }
        />
      </StyledContainer>
    );
  };

  const renderList = (height?: string | number) => {
    return (
      <List
        dataSource={tasksToRender}
        emptyDescription="No tasks available."
        renderItem={renderTask}
      />
    );
  };

  const renderListContainer = () => {
    return (
      <StyledContainer
        style={{
          flexDirection: "column",
          width: "100%",
          flex: 1,
          overflow: "auto",
        }}
      >
        {renderList()}
      </StyledContainer>
    );
  };

  return renderListContainer();
};

export default React.memo(TaskList);
