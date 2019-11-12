import styled from "@emotion/styled";
import { Icon, Spin } from "antd";
import React from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { BlockType, IBlock } from "../../models/block/block";
import { getBlockValidChildrenTypes } from "../../models/block/utils";
import { IUser } from "../../models/user/user";
import { IBlockMethods } from "../block/methods";
import { sortBlocksByPosition } from "../block/sortBlocks";
import Group from "../group/Group";
import GroupContainer from "../group/GroupContainer";
import { BoardContext } from "./Board";

export interface IKanbanBoardProps {
  blockHandlers: IBlockMethods;
  user: IUser;
  block: IBlock;
  projects: IBlock[];
  groups: IBlock[];
  tasks: IBlock[];

  // TODO: define collaborators' type, it's slightly different from IUser
  collaborators: IUser[];
  selectedCollaborators: { [key: string]: boolean };
  context: BoardContext;
  toggleForm: (type: BlockType, parent?: IBlock, block?: IBlock) => void;
  setCurrentProject: (project: IBlock) => void;
  onClickAddChild: (type: BlockType, parent: IBlock) => void;
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
        return this.hasChildren(block.tasks);

      case "project":
        return this.hasChildren(block.projects);

      default:
        return false;
    }
  }

  private onDragEnd = async result => {
    // const { block, blockHandlers, groups, tasks, projects } = this.props;
    // const { destination, type, draggableId, source } = result;
    // if (!destination || draggableId === block.customId) {
    //   return;
    // }
    // let draggedBlock: IBlock;
    // let sourceBlock: IBlock;
    // let destinationBlock: IBlock;
    // let dropPosition = result.destination.index;
    // this.setState({ loading: true });
    // if (type === "GROUP") {
    //   sourceBlock = block;
    //   destinationBlock = block;
    //   draggedBlock = groups!.find(group => group.customId === draggableId)!;
    //   dropPosition -= 1;
    //   result.destination.index = dropPosition;
    //   if (dropPosition < 0) {
    //     this.setState({ loading: false });
    //     return;
    //   }
    // } else if (type === "TASK") {
    //   if (destination.droppableId === "ungrouped") {
    //     destinationBlock = block;
    //   } else {
    //     destinationBlock = groups!.find(
    //       group => group.customId === destination.droppableId
    //     )!;
    //   }
    //   if (source.droppableId === "ungrouped") {
    //     sourceBlock = block;
    //   } else {
    //     sourceBlock = groups!.find(
    //       group => group.customId === source.droppableId
    //     )!;
    //   }
    //   // TODO : Transferring blocks should maybe be done in redux, cause not all tasks
    //   // or projects are here. Groups are okay though.
    //   draggedBlock = tasks!.find(task => task.customId === draggableId)!;
    // } else if (type === "PROJECT") {
    //   if (destination.droppableId === "ungrouped") {
    //     destinationBlock = block;
    //   } else {
    //     destinationBlock = groups!.find(
    //       group => group.customId === destination.droppableId
    //     )!;
    //   }
    //   if (source.droppableId === "ungrouped") {
    //     sourceBlock = block;
    //   } else {
    //     sourceBlock = groups!.find(
    //       group => group.customId === source.droppableId
    //     )!;
    //   }
    //   draggedBlock = projects!.find(
    //     project => project.customId === draggableId
    //   )!;
    // }
    // await blockHandlers.onTransferBlock({
    //   draggedBlock: draggedBlock!,
    //   sourceBlock: sourceBlock!,
    //   destinationBlock: destinationBlock!,
    //   dragInformation: result
    // });
    // this.setState({ loading: false });
  };

  private hasChildren(idArray) {
    if (Array.isArray(idArray) && idArray.length > 0) {
      return true;
    }

    return false;
  }

  private renderGroups = () => {
    const {
      user,
      tasks,
      projects,
      onClickAddChild,
      block,
      context,
      toggleForm,
      selectedCollaborators,
      setCurrentProject,
      onSelectGroup,
      blockHandlers,
      groups: blockGroups
    } = this.props;
    const sortedGroupIds =
      context === "task" ? block.groupTaskContext : block.groupProjectContext;

    const groups = sortBlocksByPosition(blockGroups || [], sortedGroupIds);
    const rendered: JSX.Element[] = [];
    const blockHasUngrouped = this.blockHasUngrouped(block);

    if (blockHasUngrouped) {
      const ungrouped = (
        <Group
          disabled
          isUngrouped
          blockHandlers={blockHandlers}
          user={user}
          tasks={tasks}
          projects={projects}
          withViewMore={false}
          key="ungrouped"
          group={{
            ...block,
            name: context === "task" ? "Ungrouped Tasks" : "Ungrouped Projects"
          }}
          draggableID="ungrouped"
          onClickAddChild={(type: BlockType) => onClickAddChild(type, block)}
          toggleForm={(type: BlockType, child?: IBlock) =>
            toggleForm(type, block, child)
          }
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
      const groupHasChildrenInContext = this.doesBlockHaveChildren(
        group,
        context
      );

      if (groupHasChildrenInContext) {
        rendered.push(
          <GroupContainer
            withViewMore={false}
            key={groupId}
            group={group}
            draggableID={groupId}
            onClickAddChild={onClickAddChild}
            toggleForm={(type: BlockType, child?: IBlock) =>
              toggleForm(
                type,
                child && child.customId === group.customId ? block : group,
                child
              )
            }
            index={blockHasUngrouped ? index + 1 : index}
            context={context}
            selectedCollaborators={selectedCollaborators}
            setCurrentProject={setCurrentProject}
            onViewMore={() => onSelectGroup(group, false)}
          />
        );
      }
    });

    return rendered;
  };

  private renderBlockChildren = () => {
    const renderedGroups = this.renderGroups();
    return <React.Fragment>{renderedGroups}</React.Fragment>;
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

  private doesBlockHaveChildren(block: IBlock, context?: BoardContext) {
    const checkChildren = (type: string) => {
      const plural = `${type}s`;
      return Array.isArray(block[plural]) && block[plural].length > 0;
    };

    if (context) {
      return checkChildren(context);
    } else {
      const childrenTypes = getBlockValidChildrenTypes(block.type);
      return !!childrenTypes.find(checkChildren);
    }
  }
}

const KanbanBoardInner = styled.div`
  width: 100%;
  height: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  flex: 1;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  box-sizing: border-box;
`;

const KanbanBoardDroppable = styled.div`
  height: 100%;
  display: flex;
  padding: 12px 16px;
  box-sizing: border-box;
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
