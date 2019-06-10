import React from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import values from "lodash/values";
import Group from "./Group.jsx";
import MiniTask from "../task/MiniTask.jsx";
import ProjectThumbnail from "../project/ProjectThumbnail.jsx";
import { getBlockValidChildrenTypes } from "../../../models/block/utils";
import { DraggableItem } from "../dnd";
import DataLoader from "./DataLoader";
import { sortBlocksByPosition } from "./sortBlocks";

class KanbanBoard extends React.Component {
  fetchChildren = async block => {
    const { blockHandlers } = this.props;
    await blockHandlers.getBlockChildren(block);
  };

  onDragEnd = async result => {
    const { rootBlock, blockHandlers } = this.props;
    const { destination, type, draggableId } = result;

    if (!destination) {
      return;
    }

    let draggedBlock = null;
    let sourceBlock = null;
    let destinationBlock = null;

    if (type === "GROUP") {
      sourceBlock = rootBlock;
      destinationBlock = rootBlock;
      draggedBlock = rootBlock.group[draggableId];
    } else if (type === "TASKS_AND_PROJECTS") {
      const [parentId, blockType, blockId] = draggableId.split(".");
      let groupContainer = rootBlock.group;
      let typeContainer = null;
      sourceBlock = groupContainer[parentId];
      destinationBlock = groupContainer[destination.droppableId];
      typeContainer = sourceBlock[blockType];
      draggedBlock = typeContainer[blockId];
    }

    await blockHandlers.onDragAndDropBlock(
      draggedBlock,
      sourceBlock,
      destinationBlock,
      result
    );
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
    const { blockHandlers, user, rootBlock, collaborators } = this.props;
    const tasksToRender = sortBlocksByPosition(tasks);

    return tasksToRender.map((task, index) => {
      return (
        <DraggableItem
          key={task.customId}
          draggableProps={{
            index,
            draggableId: `${parent.customId}.task.${task.customId}`
          }}
          getContainer={() => ({ container: DraggableBlock })}
        >
          <MiniTask
            user={user}
            task={task}
            collaborators={collaborators}
            blockHandlers={blockHandlers}
            onEdit={task => this.toggleForm("task", parent || rootBlock, task)}
          />
        </DraggableItem>
      );
    });
  }

  renderProjects(projects, parent) {
    const { setCurrentProject } = this.props;
    const projectsToRender = sortBlocksByPosition(projects);

    return projectsToRender.map((project, index) => {
      return (
        <DraggableItem
          key={project.customId}
          getContainer={() => ({ container: DraggableBlock })}
          draggableProps={{
            index,
            draggableId: `${parent.customId}.project.${project.customId}`
          }}
        >
          <ProjectThumbnail
            project={project}
            onClick={() => setCurrentProject(project)}
          />
        </DraggableItem>
      );
    });
  }

  renderGroupChildren = block => {
    return (
      <DataLoader
        data={block}
        areDataSame={this.areBlocksSame}
        isDataLoaded={this.isBlockChildrenLoaded}
        loadData={this.fetchChildren}
        render={block => (
          <React.Fragment>
            {this.renderTasks(block.task, block)}
            {this.renderProjects(block.project, block)}
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
      user
    } = this.props;
    let groups = values(rootBlock.group || {});
    groups = sortBlocksByPosition(groups);

    return groups.map((group, index) => {
      let groupId = group.customId;
      let groupProps = {
        group,
        user,
        onEdit,
        index,
        blockHandlers,
        onClickAddChild,
        draggableId: groupId,
        droppableId: groupId,
        isViewOnly: false
      };

      return (
        <Group key={groupId} {...groupProps}>
          {this.renderGroupChildren(group)}
        </Group>
      );
    });
  };

  renderBlockChildren = () => {
    return <React.Fragment>{this.renderGroups()}</React.Fragment>;
  };

  render() {
    const { rootBlock } = this.props;

    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <KanbanBoardContainer>
          <KanbanBoardInner>
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
                  <DataLoader
                    render={this.renderBlockChildren}
                    areDataSame={this.areBlocksSame}
                    isDataLoaded={this.isBlockChildrenLoaded}
                    loadData={this.fetchChildren}
                    data={rootBlock}
                  />
                  {provided.placeholder}
                </KanbanBoardDroppable>
              )}
            </Droppable>
          </KanbanBoardInner>
        </KanbanBoardContainer>
      </DragDropContext>
    );
  }
}

const KanbanBoardContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
`;

const KanbanBoardInner = styled.div`
  padding: 16px;
  display: block;
  width: 100%;
  height: 100%;
  white-space: nowrap;
  overflow-x: auto;
  overflow-y: hidden;
`;

const KanbanBoardDroppable = styled.div`
  height: 100%;
  width: 100%;
  display: inline-flex;
`;

const DraggableBlock = styled.div`
  margin: 12px;
`;

export default KanbanBoard;
