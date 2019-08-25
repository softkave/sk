import styled from "@emotion/styled";
import { Icon, Spin } from "antd";
import React from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

import { IBlock } from "../../../models/block/block";
import { IUser } from "../../../models/user/user";
import { IBlockMethods } from "../methods";
import GroupContainer from "./GroupContainer";
import { sortBlocksByPosition } from "./sortBlocks";

export interface IKanbanBoardProps {
  blockHandlers: IBlockMethods;
  user: IUser;
  block: IBlock;
  projects?: IBlock[];
  groups?: IBlock[];
  tasks?: IBlock[];

  // TODO: define collaborators' type, it's slightly different from IUser
  collaborators: IUser[];
  selectedCollaborators: { [key: string]: boolean };
  context: "task" | "project";
  toggleForm: (type: string, parent: IBlock, block: IBlock) => void;
  setCurrentProject: (project: IBlock) => void;
  onClickAddChild: (type: string, group: IBlock) => void;
  onSelectGroup: (group: IBlock, isRootBlock: boolean) => void;
}

interface IKanbanBoardState {
  loading: boolean;
}

class KanbanBoard extends React.PureComponent<
  IKanbanBoardProps,
  IKanbanBoardState
> {
  public state = {
    loading: false
  };

  public render() {
    return this.renderMain();
  }

  private blockHasUngrouped(block) {
    const { context: type } = this.props;

    switch (type) {
      case "task":
        return this.hasChildren(block.task);

      case "project":
        return this.hasChildren(block.project);

      default:
        return false;
    }
  }

  private onDragEnd = async result => {
    const { block, blockHandlers, groups, tasks, projects } = this.props;
    const { destination, type, draggableId, source } = result;

    if (!destination || draggableId === block.customId) {
      return;
    }

    let draggedBlock: IBlock;
    let sourceBlock: IBlock;
    let destinationBlock: IBlock;
    let dropPosition = result.destination.index;

    this.setState({ loading: true });

    if (type === "GROUP") {
      sourceBlock = block;
      destinationBlock = block;
      draggedBlock = groups!.find(group => group.customId === draggableId)!;

      dropPosition -= 1;
      result.destination.index = dropPosition;

      if (dropPosition < 0) {
        this.setState({ loading: false });
        return;
      }
    } else if (type === "TASK") {
      if (destination.droppableId === "ungrouped") {
        destinationBlock = block;
      } else {
        destinationBlock = groups!.find(
          group => group.customId === destination.droppableId
        )!;
      }

      if (source.droppableId === "ungrouped") {
        sourceBlock = block;
      } else {
        sourceBlock = groups!.find(
          group => group.customId === source.droppableId
        )!;
      }

      draggedBlock = tasks!.find(task => task.customId === draggableId)!;
    } else if (type === "PROJECT") {
      if (destination.droppableId === "ungrouped") {
        destinationBlock = block;
      } else {
        destinationBlock = groups!.find(
          group => group.customId === destination.droppableId
        )!;
      }

      if (source.droppableId === "ungrouped") {
        sourceBlock = block;
      } else {
        sourceBlock = groups!.find(
          group => group.customId === source.droppableId
        )!;
      }

      draggedBlock = projects!.find(
        project => project.customId === draggableId
      )!;
    }

    await blockHandlers.onTransferBlock({
      draggedBlock: draggedBlock!,
      sourceBlock: sourceBlock!,
      destinationBlock: destinationBlock!,
      dragInformation: result
    });

    this.setState({ loading: false });
  };

  private hasChildren(obj) {
    if (obj && typeof obj === "object") {
      return Object.keys(obj).length > 0;
    }

    return false;
  }

  private renderGroups = () => {
    const {
      onClickAddChild,
      block,
      context,
      toggleForm,
      selectedCollaborators,
      setCurrentProject,
      onSelectGroup,
      groups: blockGroups
    } = this.props;
    const sortedGroupIds =
      context === "task" ? block.groupTaskContext : block.groupProjectContext;

    const groups = sortBlocksByPosition(blockGroups || [], sortedGroupIds);
    const rendered: JSX.Element[] = [];
    const blockHasUngrouped = this.blockHasUngrouped(block);

    if (blockHasUngrouped) {
      const ungrouped = (
        <GroupContainer
          disabled
          withViewMore={false}
          key="ungrouped"
          group={{
            ...block,
            name: "...",
            type: "group"
          }}
          draggableID="ungrouped"
          onClickAddChild={onClickAddChild}
          toggleForm={() => null}
          index={0}
          context={context}
          selectedCollaborators={selectedCollaborators}
          setCurrentProject={setCurrentProject}
          onViewMore={() => onSelectGroup(block, true)}
        />
      );

      rendered.push(ungrouped);
    }

    groups.forEach((group, index) => {
      const groupId = group.customId;

      rendered.push(
        <GroupContainer
          withViewMore={false}
          key={groupId}
          group={group}
          draggableID={groupId}
          onClickAddChild={onClickAddChild}
          toggleForm={() => toggleForm("group", block, group)}
          index={blockHasUngrouped ? index + 1 : index}
          context={context}
          selectedCollaborators={selectedCollaborators}
          setCurrentProject={setCurrentProject}
          onViewMore={() => onSelectGroup(group, false)}
        />
      );
    });

    return rendered;
  };

  private renderBlockChildren = () => {
    return <React.Fragment>{this.renderGroups()}</React.Fragment>;
  };

  private renderMain = () => {
    const { block: rootBlock } = this.props;
    const { loading } = this.state;

    const rendered = (
      <KanbanBoardInner>
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable
            droppableId={rootBlock.customId}
            type="GROUP"
            direction="horizontal"
          >
            {(provided, snapshot) => (
              <KanbanBoardDroppable
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {this.renderBlockChildren()}
                {provided.placeholder}
              </KanbanBoardDroppable>
            )}
          </Droppable>
        </DragDropContext>
      </KanbanBoardInner>
    );

    if (loading) {
      return (
        <SpinContainer>
          <Spin
            spinning={loading}
            indicator={<Icon type="loading" style={{ fontSize: "2em" }} />}
            style={{ height: "100%" }}
          >
            {rendered}
          </Spin>
        </SpinContainer>
      );
    }

    return rendered;
  };
}

const KanbanBoardInner = styled.div`
  width: 100%;
  height: 100%;
  white-space: nowrap;
  overflow-x: auto;
  flex: 1;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  padding: 12px 0;
`;

const KanbanBoardDroppable = styled.div`
  min-height: 100%;
  display: inline-flex;
  padding: 0 16px;
`;

const SpinContainer = styled.div`
  width: 100%;
  height: 100%;

  & .ant-spin-container {
    height: 100%;
  }

  & .ant-spin-nested-loading {
    height: 100%;
  }
`;

export default KanbanBoard;