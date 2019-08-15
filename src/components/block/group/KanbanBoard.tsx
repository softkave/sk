import styled from "@emotion/styled";
import { Icon, Spin } from "antd";
import values from "lodash/values";
import React from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

import { IBlock } from "../../../models/block/block";
import { getBlockValidChildrenTypes } from "../../../models/block/utils";
import { IUser } from "../../../models/user/user";
import { IBlockMethods } from "../methods";
import DataLoader from "./DataLoader";
import Group from "./Group";
import GroupContainer from "./GroupContainer";
import { sortBlocksByPosition } from "./sortBlocks";

export interface IKanbanBoardProps {
  blockHandlers: IBlockMethods;
  user: IUser;
  rootBlock: IBlock;

  // TODO: define collaborators' type, it's slightly different from IUser
  collaborators: IUser[];
  selectedCollaborators: { [key: string]: boolean };
  type: "task" | "project";
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

  public fetchChildren = async block => {
    const { blockHandlers } = this.props;
    await blockHandlers.getBlockChildren(block);
  };

  public blockHasUngrouped(block) {
    const { type } = this.props;

    switch (type) {
      case "task":
        return this.hasChildren(block.task);

      case "project":
        return this.hasChildren(block.project);

      default:
        return false;
    }
  }

  public onDragEnd = async result => {
    const { rootBlock, blockHandlers } = this.props;
    const { destination, type, draggableId, source } = result;

    if (!destination || draggableId === rootBlock.customId) {
      return;
    }

    let draggedBlock: IBlock;
    let sourceBlock: IBlock;
    let destinationBlock: IBlock;
    let dropPosition = result.destination.index;

    this.setState({ loading: true });

    if (type === "GROUP") {
      sourceBlock = rootBlock;
      destinationBlock = rootBlock;
      draggedBlock = rootBlock.group[draggableId];

      dropPosition -= 1;
      result.destination.index = dropPosition;

      if (dropPosition < 0) {
        this.setState({ loading: false });
        return;
      }
    } else if (type === "TASK") {
      if (destination.droppableId === "ungrouped") {
        destinationBlock = rootBlock;
      } else {
        destinationBlock = rootBlock.group[destination.droppableId];
      }

      if (source.droppableId === "ungrouped") {
        sourceBlock = rootBlock;
      } else {
        sourceBlock = rootBlock.group[source.droppableId];
      }

      draggedBlock = sourceBlock.task[draggableId];
    } else if (type === "PROJECT") {
      if (destination.droppableId === "ungrouped") {
        destinationBlock = rootBlock;
      } else {
        destinationBlock = rootBlock.group[destination.droppableId];
      }

      if (source.droppableId === "ungrouped") {
        sourceBlock = rootBlock;
      } else {
        sourceBlock = rootBlock.group[source.droppableId];
      }

      draggedBlock = sourceBlock.project[draggableId];
    }

    await blockHandlers.onTransferBlock({
      draggedBlock: draggedBlock!,
      sourceBlock: sourceBlock!,
      destinationBlock: destinationBlock!,
      dragInformation: result
    });

    this.setState({ loading: false });
  };

  public hasChildren(obj) {
    if (obj && typeof obj === "object") {
      return Object.keys(obj).length > 0;
    }

    return false;
  }

  public areBlocksSame(block1, block2) {
    if (block1.customId === block2.customId) {
      return true;
    } else {
      return false;
    }
  }

  public isBlockChildrenLoaded(block) {
    const validChildrenTypes = getBlockValidChildrenTypes(block);
    return !!!validChildrenTypes.find(type => {
      if (block[type] === undefined) {
        return true;
      }

      return false;
    });
  }

  public renderGroups = () => {
    const {
      onClickAddChild,
      rootBlock,
      type,
      toggleForm,
      selectedCollaborators,
      setCurrentProject,
      onSelectGroup
    } = this.props;
    const sortedIds =
      type === "task"
        ? rootBlock.groupTaskContext
        : rootBlock.groupProjectContext;

    const groups = sortBlocksByPosition(rootBlock.group, sortedIds);
    const rendered: JSX.Element[] = [];
    const blockHasUngrouped = this.blockHasUngrouped(rootBlock);

    if (blockHasUngrouped) {
      const ungrouped = (
        <GroupContainer
          disabled
          withViewMore={false}
          key="ungrouped"
          group={
            {
              name: "..."
            } as IBlock
          }
          draggableID="ungrouped"
          onClickAddChild={onClickAddChild}
          toggleForm={() => null}
          index={0}
          context={type}
          selectedCollaborators={selectedCollaborators}
          setCurrentProject={setCurrentProject}
          onViewMore={() => onSelectGroup(rootBlock, true)}
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
          toggleForm={() => toggleForm("group", rootBlock, group)}
          index={blockHasUngrouped ? index + 1 : index}
          context={type}
          selectedCollaborators={selectedCollaborators}
          setCurrentProject={setCurrentProject}
          onViewMore={() => onSelectGroup(group, false)}
        />
      );
    });

    return rendered;
  };

  public renderBlockChildren = () => {
    return <React.Fragment>{this.renderGroups()}</React.Fragment>;
  };

  public renderMain = () => {
    const { rootBlock } = this.props;
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

  public render() {
    const { rootBlock } = this.props;

    return (
      <DataLoader
        render={this.renderMain}
        areDataSame={this.areBlocksSame}
        isDataLoaded={this.isBlockChildrenLoaded}
        loadData={this.fetchChildren}
        data={rootBlock}
      />
    );
  }
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
