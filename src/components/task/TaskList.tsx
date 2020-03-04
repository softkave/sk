import styled from "@emotion/styled";
import { Divider } from "antd";
import isObject from "lodash/isObject";
import React from "react";
import { IBlock } from "../../models/block/block";
import { sortBlocksByPriority } from "../block/sortBlocks";
import List from "../styled/List";
import Task from "./Task";

export interface ITaskListProps {
  tasks: IBlock[];
  toggleForm?: (block: IBlock) => void;
  selectedCollaborators?: { [key: string]: boolean };
}

const TaskList: React.FC<ITaskListProps> = props => {
  const { toggleForm, selectedCollaborators, tasks } = props;
  const filteredTasks =
    isObject(selectedCollaborators) &&
    Object.keys(selectedCollaborators).length > 0
      ? tasks.filter(task => {
          const tc = task.taskCollaborators;

          if (Array.isArray(tc) && tc.length > 0) {
            return tc.find(c => selectedCollaborators[c.userId]);
          }

          return false;
        })
      : tasks;

  const tasksToRender = sortBlocksByPriority(filteredTasks);

  const renderTask = (task, i) => {
    return (
      <>
        <StyledBlockThumbnailContainer key={task.customId}>
          <Task
            task={task}
            onEdit={
              toggleForm ? editedTask => toggleForm(editedTask) : undefined
            }
          />
        </StyledBlockThumbnailContainer>
        {i < tasksToRender.length - 1 && <Divider />}
        {}
      </>
    );
  };

  return (
    <List
      dataSource={tasksToRender}
      rowKey="customId"
      emptyDescription="No tasks available."
      renderItem={renderTask}
    />
  );
};

export default TaskList;

const StyledBlockThumbnailContainer = styled.div`
  margin-top: 12px;
  margin-bottom: 12px;
`;
