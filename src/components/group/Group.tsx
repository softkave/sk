import styled from "@emotion/styled";
import { Button, Dropdown, Menu, Modal } from "antd";
import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { BlockType, IBlock } from "../../models/block/block";
import { IUser } from "../../models/user/user";
import { IBlockMethods } from "../block/methods";
import { BoardContext } from "../board/Board";
import { getChildrenTypesForContext } from "../board/childrenTypes";
import StyledCapitalizeText from "../StyledCapitalizeText";
import GroupHeader from "./GroupHeader";
import ProjectList from "./ProjectList";
import TaskList from "./TaskList";
import TaskListWithViewMore from "./TaskListWithViewMore";

const editGroupKey = "edit-group";
const deleteGroupKey = "delete-group";

export interface IGroupProps {
  group: IBlock;
  blockHandlers: IBlockMethods;
  draggableID: string;
  index: number;
  context: BoardContext;
  selectedCollaborators: { [key: string]: boolean };
  user: IUser;
  tasks: IBlock[];
  projects: IBlock[];
  toggleForm: (type: BlockType, block?: IBlock) => void;
  onClickAddChild: (type: BlockType, group: IBlock) => void;
  setCurrentProject: (project: IBlock) => void;
  onViewMore: () => void;
  disabled?: boolean;
  withViewMore?: boolean;
  isUngrouped?: boolean;
}

class Group extends React.PureComponent<IGroupProps> {
  public render() {
    const { draggableID: draggableId, index, group } = this.props;
    console.log(this.props);

    return (
      <Draggable
        index={index}
        draggableId={draggableId}
        // isDragDisabled={disabled}
        isDragDisabled={true}
      >
        {(provided, snapshot) => {
          return (
            <GroupContainer
              ref={provided.innerRef}
              {...provided.draggableProps}
            >
              <GroupContainerInner>
                <GroupHeaderDiv {...provided.dragHandleProps}>
                  <GroupHeader
                    name={group.name}
                    controls={this.renderControls()}
                  />
                </GroupHeaderDiv>
                <GroupBodyDiv>{this.renderContext()}</GroupBodyDiv>
              </GroupContainerInner>
            </GroupContainer>
          );
        }}
      </Draggable>
    );
  }

  private renderContext() {
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

  private promptDeleteGroup() {
    const { blockHandlers, group } = this.props;

    Modal.confirm({
      title: "Are you sure you want to delete this group",
      okText: "Yes",
      cancelText: "No",
      okType: "danger",
      onOk() {
        blockHandlers.onDelete(group);
      },
      onCancel() {
        // Do nothing
      }
    });
  }

  private onSelectControl = event => {
    const { group, onClickAddChild, context, toggleForm } = this.props;
    const childrenTypes = getChildrenTypesForContext(group, context);

    if (childrenTypes.indexOf(event.key) !== -1) {
      onClickAddChild(event.key, group);
    } else {
      switch (event.key) {
        case deleteGroupKey: {
          this.promptDeleteGroup();
          break;
        }

        case editGroupKey: {
          toggleForm(group.type, group);
          break;
        }
      }
    }
  };

  private renderControls() {
    const { group, context, isUngrouped } = this.props;
    const childrenTypes = getChildrenTypesForContext(group, context).filter(
      type => {
        return type !== "group";
      }
    );

    const overlay = (
      <Menu onClick={this.onSelectControl}>
        {childrenTypes.map(type => {
          return (
            <Menu.Item key={type}>
              <StyledCapitalizeText>{`Create ${type}`}</StyledCapitalizeText>
            </Menu.Item>
          );
        })}
        {!isUngrouped && [
          <Menu.Divider key="divider" />,
          <Menu.Item key={editGroupKey}>
            <StyledCapitalizeText>Edit Group</StyledCapitalizeText>
          </Menu.Item>,
          <Menu.Item key={deleteGroupKey}>
            <StyledCapitalizeText>Delete Group</StyledCapitalizeText>
          </Menu.Item>
        ]}
      </Menu>
    );

    return (
      <Dropdown overlay={overlay} trigger={["click"]}>
        <OpenControlButtonSpan>
          <Button icon="ellipsis"></Button>
        </OpenControlButtonSpan>
      </Dropdown>
    );
  }
}

const OpenControlButtonSpan = styled("span")({
  "& .anticon": {}
});

const GroupHeaderDiv = styled.div``;

const GroupBodyDiv = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
`;

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
