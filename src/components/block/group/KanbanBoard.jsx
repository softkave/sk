import React from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
// import styled from "styled-components";
import styled from "@emotion/styled";
import { Spin, Icon } from "antd";
import values from "lodash/values";
import Group from "./Group.jsx";
import MiniTask from "../task/MiniTask.jsx";
import ProjectThumbnail from "../project/ProjectThumbnail.jsx";
import { getBlockValidChildrenTypes } from "../../../models/block/utils";
import { DraggableItem } from "../dnd";
import DataLoader from "./DataLoader";
import { sortBlocksByPosition } from "./sortBlocks";
import withSpinner from "../../withSpinner.jsx";

class KanbanBoard extends React.PureComponent {
  state = {
    loading: false
  };

  fetchChildren = async block => {
    const { blockHandlers } = this.props;
    await blockHandlers.getBlockChildren(block);
  };

  onDragEnd = async result => {
    const { rootBlock, blockHandlers, toggleSpinning } = this.props;
    const { destination, type, draggableId, source } = result;

    if (!destination || draggableId === "Ungrouped") {
      return;
    }

    let draggedBlock = null;
    let sourceBlock = null;
    let destinationBlock = null;

    // toggleSpinning();
    this.setState({ loading: true });

    if (type === "GROUP") {
      sourceBlock = rootBlock;
      destinationBlock = rootBlock;
      draggedBlock = rootBlock.group[draggableId];
    } else if (type === "TASK") {
      if (destination.droppableId === rootBlock.customId) {
        destinationBlock = rootBlock;
      } else {
        destinationBlock = rootBlock.group[destination.droppableId];
      }

      if (source.droppableId === rootBlock.customId) {
        sourceBlock = rootBlock;
      } else {
        sourceBlock = rootBlock.group[source.droppableId];
      }

      draggedBlock = sourceBlock["task"][draggableId];

      // const [parentId, blockType, blockId] = draggableId.split(".");

      // if (parentId === rootBlock.customId) {
      //   sourceBlock = rootBlock;
      // } else {
      //   let groupContainer = rootBlock.group;
      //   sourceBlock = groupContainer[parentId];
      // }

      // if (destination.droppableId === rootBlock.customId) {
      //   destinationBlock = rootBlock;
      // } else {
      //   let groupContainer = rootBlock.group;
      //   sourceBlock = groupContainer[destination.droppableId];
      // }

      // draggedBlock = sourceBlock[blockType][blockId];

      // let groupContainer = rootBlock.group;
      // let typeContainer = null;
      // sourceBlock = groupContainer[parentId];
      // destinationBlock = groupContainer[destination.droppableId];
      // typeContainer = sourceBlock[blockType];
      // draggedBlock = typeContainer[blockId];
    } else if (type === "PROJECT") {
      if (destination.droppableId === rootBlock.customId) {
        destinationBlock = rootBlock;
      } else {
        destinationBlock = rootBlock.group[destination.droppableId];
      }

      if (source.droppableId === rootBlock.customId) {
        sourceBlock = rootBlock;
      } else {
        sourceBlock = rootBlock.group[source.droppableId];
      }

      draggedBlock = sourceBlock["project"][draggableId];
    }

    await blockHandlers.onDragAndDropBlock(
      draggedBlock,
      sourceBlock,
      destinationBlock,
      result
    );

    // toggleSpinning();
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
    const { blockHandlers, user, rootBlock, collaborators } = this.props;
    // const tasksToRender = sortBlocksByPosition(tasks);
    const tasksToRender = sortBlocksByPosition(tasks, parent.tasks);
    console.log(parent.name, { tasksToRender, tasks, parent });

    const renderedTasks = tasksToRender.map((task, index) => {
      return (
        <DraggableItem
          key={task.customId}
          draggableProps={{
            index,
            draggableId: task.customId
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

    return renderedTasks;

    // return (
    //   <div>
    //     Tasks
    //     <Droppable droppableId={parent.customId} type="TASK">
    //       {(provided, snapshot) => (
    //         <div ref={provided.innerRef} {...provided.droppableProps}>
    //           {renderedTasks}
    //           {provided.placeholder}
    //         </div>
    //       )}
    //     </Droppable>
    //   </div>
    // );
  }

  renderProjects(projects, parent) {
    const { setCurrentProject } = this.props;
    // const projectsToRender = sortBlocksByPosition(projects);
    const projectsToRender = sortBlocksByPosition(projects, parent.projects);
    console.log({ projects, projectsToRender });

    const renderedProjects = projectsToRender.map((project, index) => {
      return (
        <DraggableItem
          key={project.customId}
          getContainer={() => ({ container: DraggableBlock })}
          draggableProps={{
            index,
            draggableId: project.customId
          }}
        >
          <ProjectThumbnail
            project={project}
            onClick={() => setCurrentProject(project)}
          />
        </DraggableItem>
      );
    });

    return renderedProjects;

    // return (
    //   <div>
    //     Projects
    //     <Droppable droppableId={parent.customId} type="PROJECT">
    //       {(provided, snapshot) => (
    //         <div ref={provided.innerRef} {...provided.droppableProps}>
    //           {renderedProjects}
    //           {provided.placeholder}
    //         </div>
    //       )}
    //     </Droppable>
    //   </div>
    // );
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
            {/* {this.renderTasks(block.task, block)}
            {this.renderProjects(block.project, block)} */}
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
    // let groups = values(rootBlock.group || {});
    // groups = sortBlocksByPosition(groups);
    const sortedIds =
      type === "task"
        ? rootBlock.groupTaskContext
        : rootBlock.groupProjectContext;

    // console.log({  })
    let groups = sortBlocksByPosition(rootBlock.group, sortedIds);
    console.log({ groups, rootBlock, sortedIds });
    let rendered = [];
    let hasUngrouped = false;

    // if (
    //   this.hasChildren(rootBlock.task) ||
    //   this.hasChildren(rootBlock.project)
    // ) {
    //   console.log(rootBlock.project);
    //   rendered.push(
    //     <Group
    //       disabled
    //       key={"Ungrouped"}
    //       group={{ name: "Ungrouped" }}
    //       user={user}
    //       onEdit={onEdit}
    //       index={0}
    //       blockHandlers={blockHandlers}
    //       onClickAddChild={onClickAddChild}
    //       draggableId={"Ungrouped"}
    //       droppableId={"Ungrouped"}
    //     >
    //       {this.renderTasks(rootBlock.task, rootBlock)}
    //       {this.renderProjects(rootBlock.project, rootBlock)}
    //     </Group>
    //   );

    //   hasUngrouped = true;
    // }

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
        // index: hasUngrouped ? index + 1 : index
        index,
        render: () => this.renderGroupChildren(group, type)
      };

      rendered.push(<Group key={groupId} {...groupProps} />);
    });

    return rendered;

    // return (
    //   <Droppable
    //     droppableId={rootBlock.customId}
    //     type="GROUP"
    //     direction="horizontal"
    //   >
    //     {(provided, snapshot) => (
    //       <div ref={provided.innerRef} {...provided.droppableProps}>
    //         {rendered}
    //         {provided.placeholder}
    //       </div>
    //     )}
    //   </Droppable>
    // );
  };

  renderBlockChildren = () => {
    return <React.Fragment>{this.renderGroups()}</React.Fragment>;
  };

  renderMain = () => {
    const { rootBlock } = this.props;
    const { loading } = this.state;

    // return (
    //   <div
    //     style={{
    //       overflowX: "auto"
    //     }}
    //   >
    //     <DragDropContext onDragEnd={this.onDragEnd}>
    //       {this.renderBlockChildren()}
    //     </DragDropContext>
    //   </div>
    // );

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
        <Spin
          spinning={loading}
          indicator={<Icon type="loading" style={{ fontSize: "2em" }} />}
        >
          {rendered}
        </Spin>
      );
    }

    return rendered;

    // return (
    //   <div
    //     style={{
    //       overflowX: "auto"
    //     }}
    //   >
    //     <DragDropContext onDragEnd={this.onDragEnd}>
    //       <Droppable
    //         droppableId={rootBlock.customId}
    //         type="GROUP"
    //         direction="horizontal"
    //       >
    //         {(provided, snapshot) => (
    //           <KanbanBoardDroppable
    //             ref={provided.innerRef}
    //             {...provided.droppableProps}
    //           >
    //             {this.renderBlockChildren()}
    //             {provided.placeholder}
    //           </KanbanBoardDroppable>
    //         )}
    //       </Droppable>
    //     </DragDropContext>
    //   </div>
    // );
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

// const KanbanBoardContainer = styled.div`
//   flex: 1;
//   display: flex;
//   flex-direction: row;
//   flex-wrap: nowrap;
// `;

// const KanbanBoardContainer = styled.div``;

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

const DraggableBlock = styled.div`
  margin: 12px;
`;

// export default withSpinner(KanbanBoard);
export default KanbanBoard;

// const KanbanBoardWithSpinner = withSpinner(KanbanBoard);
// const StyledKanbanBoardWithSpinner = styled(KanbanBoardWithSpinner)({
//   ["& .ant-spin-container"]: {
//     height: "100% !important"
//   }
// });

// export default StyledKanbanBoardWithSpinner;
