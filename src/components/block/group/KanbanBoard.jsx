import React from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import styled from "@emotion/styled";
import { Spin, Icon } from "antd";
import Group from "./Group.jsx";
import MiniTask from "../task/MiniTask.jsx";
import ProjectThumbnail from "../project/ProjectThumbnail.jsx";
import { getBlockValidChildrenTypes } from "../../../models/block/utils";
// import { DraggableItem } from "../dnd";
import DataLoader from "./DataLoader";
import { sortBlocksByPosition } from "./sortBlocks";

class KanbanBoard extends React.PureComponent {
  state = {
    loading: false
  };

  fetchChildren = async block => {
    const { blockHandlers } = this.props;
    await blockHandlers.getBlockChildren(block);
  };

  blockHasUngrouped(block) {
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

  onDragEnd = async result => {
    const { rootBlock, blockHandlers } = this.props;
    const { destination, type, draggableId, source } = result;

    if (!destination || draggableId === rootBlock.customId) {
      return;
    }

    let draggedBlock = null;
    let sourceBlock = null;
    let destinationBlock = null;

    this.setState({ loading: true });

    if (type === "GROUP") {
      sourceBlock = rootBlock;
      destinationBlock = rootBlock;
      draggedBlock = rootBlock.group[draggableId];
      let dropPosition = result.destination.index;
      // result.destination.index = this.blockHasUngrouped(sourceBlock)
      //   ? dropPosition - 1
      //   : dropPosition;

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

      draggedBlock = sourceBlock["task"][draggableId];
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

      draggedBlock = sourceBlock["project"][draggableId];
    }

    await blockHandlers.onTransferBlock(
      draggedBlock,
      sourceBlock,
      destinationBlock,
      result
    );

    this.setState({ loading: false });
  };

  hasChildren(obj) {
    if (obj && typeof obj === "object") {
      return Object.keys(obj).length > 0;
    }

    return false;
  }

  areBlocksSame(block1, block2) {
    if (block1.customId === block2.customId) {
      return true;
    } else {
      return false;
    }
  }

  isBlockChildrenLoaded(block) {
    const validChildrenTypes = getBlockValidChildrenTypes(block);
    return !!!validChildrenTypes.find(type => {
      if (block[type] === undefined) {
        return true;
      }

      return false;
    });
  }

  renderTasks(tasks, parent) {
    const {
      blockHandlers,
      user,
      rootBlock,
      collaborators,
      toggleForm
    } = this.props;
    const tasksToRender = sortBlocksByPosition(tasks, parent.tasks);

    const renderedTasks = tasksToRender.map((task, index) => {
      // return (
      //   <DraggableItem
      //     key={task.customId}
      //     draggableProps={{
      //       index,
      //       draggableId: task.customId
      //     }}
      //     getContainer={() => ({ container: DraggableBlock })}
      //   >
      //     <MiniTask
      //       user={user}
      //       task={task}
      //       collaborators={collaborators}
      //       blockHandlers={blockHandlers}
      //       onEdit={task => this.toggleForm("task", parent || rootBlock, task)}
      //     />
      //   </DraggableItem>
      // );

      return (
        <BlockThumbnailContainer key={task.customId}>
          <MiniTask
            user={user}
            task={task}
            collaborators={collaborators}
            blockHandlers={blockHandlers}
            onEdit={task => toggleForm("task", parent || rootBlock, task)}
          />
        </BlockThumbnailContainer>
      );
    });

    return renderedTasks;
  }

  renderProjects(projects, parent) {
    const { setCurrentProject } = this.props;
    const projectsToRender = sortBlocksByPosition(projects, parent.projects);
    const renderedProjects = projectsToRender.map((project, index) => {
      // return (
      //   <DraggableItem
      //     key={project.customId}
      //     getContainer={() => ({ container: DraggableBlock })}
      //     draggableProps={{
      //       index,
      //       draggableId: project.customId
      //     }}
      //   >
      //     <ProjectThumbnail
      //       project={project}
      //       onClick={() => setCurrentProject(project)}
      //     />
      //   </DraggableItem>
      // );

      return (
        <BlockThumbnailContainer key={project.customId}>
          <ProjectThumbnail
            project={project}
            onClick={() => setCurrentProject(project)}
          />
        </BlockThumbnailContainer>
      );
    });

    return renderedProjects;
  }

  renderGroupChildren = (block, context) => {
    return (
      <DataLoader
        data={block}
        areDataSame={this.areBlocksSame}
        isDataLoaded={this.isBlockChildrenLoaded}
        loadData={this.fetchChildren}
        render={block => (
          <React.Fragment>
            {context === "task"
              ? this.renderTasks(block.task, block)
              : this.renderProjects(block.project, block)}
          </React.Fragment>
        )}
      />
    );
  };

  renderGroups = () => {
    const {
      blockHandlers,
      onClickAddChild,
      onEdit,
      rootBlock,
      user,
      type
    } = this.props;
    const sortedIds =
      type === "task"
        ? rootBlock.groupTaskContext
        : rootBlock.groupProjectContext;

    let groups = sortBlocksByPosition(rootBlock.group, sortedIds);
    let rendered = [];
    const ungrouped = (
      <Group
        disabled
        key="ungrouped"
        type={type}
        group={{ name: "ungrouped" }}
        user={user}
        draggableId="ungrouped"
        droppableId="ungrouped"
        index={0}
        render={
          type === "task"
            ? () => this.renderTasks(rootBlock.task, rootBlock)
            : () => this.renderProjects(rootBlock.project, rootBlock)
        }
      />
    );

    rendered.push(ungrouped);

    groups.forEach((group, index) => {
      let groupId = group.customId;
      let groupProps = {
        type,
        group,
        user,
        onEdit,
        blockHandlers,
        onClickAddChild,
        draggableId: groupId,
        droppableId: groupId,
        index: index + 1,
        render: () => this.renderGroupChildren(group, type)
      };

      rendered.push(<Group key={groupId} {...groupProps} />);
    });

    return rendered;
  };

  renderBlockChildren = () => {
    return <React.Fragment>{this.renderGroups()}</React.Fragment>;
  };

  renderMain = () => {
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

  render() {
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

// const DraggableBlock = styled.div`
//   margin: 12px;
// `;

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

const BlockThumbnailContainer = styled.div`
  margin-top: 12px;
  margin-bottom: 12px;
`;

export default KanbanBoard;
