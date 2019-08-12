import styled from "@emotion/styled";
import { Button } from "antd";
import React from "react";
import { Draggable } from "react-beautiful-dnd";

import { IBlock } from "../../../models/block/block.js";
import { IUser } from "../../../models/user/user";
import { IBlockMethods } from "../methods.js";
import GroupHeader from "./GroupHeader";
import ProjectList from "./ProjectList.jsx";
import TaskList from "./TaskList.jsx";
import TaskListWithViewMore from "./TaskListWithViewMore.jsx";

export interface IGroupProps {
  group: IBlock;
  blockHandlers: IBlockMethods;
  draggableID: string;
  index: number;
  context: "task" | "project";
  selectedCollaborators: { [key: string]: boolean };
  user: IUser;
  tasks: IBlock[];
  projects: IBlock[];
  toggleForm: (type: string, block: IBlock) => void;
  onClickAddChild: (type: string, group: IBlock) => void;
  setCurrentProject: (project: IBlock) => void;
  onViewMore: () => void;
  disabled?: boolean;
  withViewMore?: boolean;
}

class Group extends React.PureComponent<IGroupProps> {
  public renderContext() {
    const {
      group,
      context,
      projects,
      tasks,
      blockHandlers,
      user,
      setCurrentProject,
      onViewMore,
      selectedCollaborators,
      toggleForm,
      withViewMore
    } = this.props;

    if (context === "project") {
      return (
        <ProjectList
          blockHandlers={blockHandlers}
          user={user}
          projects={projects}
          setCurrentProject={setCurrentProject}
        />
      );
    } else if (context === "task") {
      if (withViewMore) {
        return (
          <TaskListWithViewMore
            blockHandlers={blockHandlers}
            selectedCollaborators={selectedCollaborators}
            user={user}
            tasks={tasks}
            parent={group}
            toggleForm={toggleForm}
            onViewMore={onViewMore}
          />
        );
      } else {
        return (
          <TaskList
            blockHandlers={blockHandlers}
            selectedCollaborators={selectedCollaborators}
            user={user}
            tasks={tasks}
            parent={group}
            toggleForm={toggleForm}
          />
        );
      }
    }
  }

  public render() {
    const { draggableID: draggableId, index, disabled, group } = this.props;

    return (
      <Draggable
        index={index}
        draggableId={draggableId}
        isDragDisabled={disabled}
      >
        {(provided, snapshot) => {
          return (
            <GroupContainer
              ref={provided.innerRef}
              {...provided.draggableProps}
            >
              <GroupContainerInner>
                <div {...provided.dragHandleProps}>
                  <GroupHeader name={group.name} />
                </div>
                {this.renderContext()}
              </GroupContainerInner>
            </GroupContainer>
          );
        }}
      </Draggable>
    );
  }
}

const GroupContainer = styled.div`
  display: flex;
  height: 100%;
  margin-right: 16px;
  width: 300px;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
  border-radius: 4px;

  &:last-of-type {
    margin-right: 0;
  }
`;

const GroupContainerInner = styled.div`
  width: 300px;
  white-space: normal;
  vertical-align: top;
  background-color: #fff;
  box-sizing: border-box;
  height: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 4px;
`;

export default Group;
