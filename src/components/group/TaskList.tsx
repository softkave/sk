import styled from "@emotion/styled";
import React from "react";

import { BlockType, IBlock } from "../../models/block/block";
import { IUser } from "../../models/user/user";
import { IBlockMethods } from "../block/methods";
import { sortBlocksByPriority } from "../block/sortBlocks";
import ScrollList from "../ScrollList";
import Task from "../task/MiniTask";

export interface ITaskListProps {
  blockHandlers: IBlockMethods;
  selectedCollaborators: { [key: string]: boolean };
  user: IUser;
  tasks: IBlock[];
  parent: IBlock;
  toggleForm: (type: BlockType, parent: IBlock, block: IBlock) => void;
}

export default class TaskList extends React.Component<ITaskListProps> {
  public isAnyCollaboratorSelected() {
    const { selectedCollaborators } = this.props;
    return (
      selectedCollaborators && Object.keys(selectedCollaborators).length > 0
    );
  }

  public renderTasks() {
    const {
      blockHandlers,
      user,
      toggleForm,
      selectedCollaborators,
      tasks,
      parent
    } = this.props;
    const filteredTasks = !this.isAnyCollaboratorSelected()
      ? tasks
      : tasks.filter(task => {
          const tc = task.taskCollaborators;

          if (Array.isArray(tc) && tc.length > 0) {
            return tc.find(c => selectedCollaborators[c.userId]);
          }

          return false;
        });

    const tasksToRender = sortBlocksByPriority(filteredTasks);
    const renderedTasks = tasksToRender.map(task => {
      return (
        <BlockThumbnailContainer key={task.customId}>
          <Task
            user={user}
            task={task}
            blockHandlers={blockHandlers}
            onEdit={editedTask => toggleForm("task", parent, editedTask)}
          />
        </BlockThumbnailContainer>
      );
    });

    return renderedTasks;
  }

  public render() {
    return (
      <ScrollList>
        <Tasks>{this.renderTasks()}</Tasks>
      </ScrollList>
    );
  }
}

const BlockThumbnailContainer = styled.div`
  margin-top: 12px;
  margin-bottom: 12px;
`;

const Tasks = styled.div`
  padding: 0 12px;
`;
