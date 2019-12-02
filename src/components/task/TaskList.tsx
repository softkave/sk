import styled from "@emotion/styled";
import isObject from "lodash/isObject";
import React from "react";
import { BlockType, IBlock } from "../../models/block/block";
import { sortBlocksByPriority } from "../block/sortBlocks";
import ScrollList from "../ScrollList";
import Task from "../task/Task";

export interface ITaskListProps {
  tasks: IBlock[];
  toggleForm?: (type: BlockType, block?: IBlock) => void;
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

  const renderTasks = () => {
    const tasksToRender = sortBlocksByPriority(filteredTasks);
    const renderedTasks = tasksToRender.map(task => {
      return (
        <StyledBlockThumbnailContainer key={task.customId}>
          <Task
            task={task}
            onEdit={
              toggleForm
                ? editedTask => toggleForm("task", editedTask)
                : undefined
            }
          />
        </StyledBlockThumbnailContainer>
      );
    });

    return renderedTasks;
  };

  return <ScrollList>{renderTasks()}</ScrollList>;
};

export default TaskList;

const StyledBlockThumbnailContainer = styled.div`
  margin-top: 12px;
  margin-bottom: 12px;
`;
