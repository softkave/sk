import styled from "@emotion/styled";
import { Icon, Spin } from "antd";
import values from "lodash/values";
import React from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

import { IBlock } from "../../../models/block/block";
import { getBlockValidChildrenTypes } from "../../../models/block/utils";
import { IUser } from "../../../models/user/user";
import { IBlockMethods } from "../methods";
import ProjectThumbnail from "../project/ProjectThumbnail";
import MiniTask from "../task/MiniTask";
import DataLoader from "./DataLoader";
import Group from "./Group";
import { sortBlocksByPosition, sortBlocksByPriority } from "./sortBlocks";

export interface IKanbanBoardProps {
  blockHandlers: IBlockMethods;
  user: IUser;
  rootBlock: IBlock;

  // TODO: define collaborators' type, it's slightly different from IUser
  collaborators: IUser[];
  selectedCollaborators: { [key: string]: boolean };
  type: string;
  toggleForm: (type: string, parent: IBlock, block: IBlock) => void;
  setCurrentProject: (project: IBlock) => void;
  onClickAddChild: (type: string, group: IBlock) => void;
  onEditGroup: (group: IBlock) => void;
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

  public isAnyCollaboratorSelected() {
    const { selectedCollaborators } = this.props;
    return (
      selectedCollaborators && Object.keys(selectedCollaborators).length > 0
    );
  }

  // TODO: Rename function
  public getTaskStat(tasks: IBlock[]) {
    const showAll = this.isAnyCollaboratorSelected();
    const sortedTasks = sortBlocksByPriority(tasks);

    if (showAll) {
      return {
        sortedTasks,
        rendered: sortedTasks,
        renderNum: tasks.length,
        showViewMore: false,
        viewMoreCount: 0
      };
    }

    // TODO: Add sorting by expiration date

    let veryImportantNum = 0;

    for (const task of sortedTasks) {
      // TODO: If perf is slow, consider mapping to boolean and comparing that instead
      if (task.priority === "very important") {
        veryImportantNum += 1;
      } else {
        break;
      }
    }

    const defaultMaxRenderedTasks = tasks.length < 5 ? tasks.length : 5;
    const renderNum =
      veryImportantNum < defaultMaxRenderedTasks
        ? defaultMaxRenderedTasks
        : veryImportantNum;

    return {
      renderNum,
      sortedTasks,
      rendered: sortedTasks.slice(0, renderNum),
      showViewMore: !(renderNum === tasks.length),
      viewMoreCount: tasks.length - renderNum
    };
  }

  public renderTasks(tasks: IBlock[], parent: IBlock) {
    const {
      blockHandlers,
      user,
      rootBlock,
      toggleForm,
      selectedCollaborators
    } = this.props;
    // const tasksToRender = sortBlocksByPosition(tasks, parent.tasks);
    const tasksArray = tasks;
    const filteredTasks = !this.isAnyCollaboratorSelected()
      ? tasksArray
      : tasksArray.filter(task => {
          const tc = task.taskCollaborators;

          if (Array.isArray(tc) && tc.length > 0) {
            return tc.find(c => selectedCollaborators[c.userId]);
          }

          return false;
        });

    const tasksToRender = filteredTasks;
    const renderedTasks = tasksToRender.map((task, index) => {
      return (
        <BlockThumbnailContainer key={task.customId}>
          <MiniTask
            user={user}
            task={task}
            blockHandlers={blockHandlers}
            onEdit={editedTask =>
              toggleForm("task", parent || rootBlock, editedTask)
            }
          />
        </BlockThumbnailContainer>
      );
    });

    return renderedTasks;
  }

  public renderProjects(projects, parent) {
    const { setCurrentProject } = this.props;
    const projectsToRender = sortBlocksByPosition(projects, parent.projects);
    const renderedProjects = projectsToRender.map((project, index) => {
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

  public renderGroup(
    group: IBlock,
    context: "task" | "project",
    index,
    isRootBlock = false
  ) {
    const {
      onSelectGroup,
      onClickAddChild,
      onEditGroup,
      blockHandlers,
      user
    } = this.props;
    let renderChildren: any = () => null;
    let props: any = {};

    if (context === "task") {
      const stat = this.getTaskStat(values(group.task));
      renderChildren = () => this.renderTasks(stat.rendered, group);
      props = {
        showViewMore: stat.showViewMore,
        viewMoreCount: stat.viewMoreCount,
        onViewMore: () => onSelectGroup(group, true)
      };
    } else {
      renderChildren = () => this.renderProjects(group.project, group);
    }

    if (isRootBlock) {

    } else {
      const keepRenderChildren = renderChildren;
      renderChildren = () => (
        <DataLoader
          data={group}
          areDataSame={this.areBlocksSame}
          isDataLoaded={this.isBlockChildrenLoaded}
          loadData={this.fetchChildren}
          render={(block) => }
        />
      );
    }

    if (isRootBlock) {
      props = {
        ...props,
        index,
        blockHandlers,
        onClickAddChild,
        disabled: true,
        key: "ungrouped",
        type: context,
        group: {
          name: "..."
        } as IBlock,
        draggableId: "ungrouped",
        droppableId: "ungrouped",
        onEdit: onEditGroup,
        render: renderChildren
      };
    } else {
      props = {
        ...props,
        group,
        user,
        index,
        blockHandlers,
        onClickAddChild,
        onEdit: onEditGroup,
        type: context,
        draggableId: group.customId,
        droppableId: group.customId,
        render: renderChildren
      };
    }

    return <Group {...props} />;
  }

  public renderGroups = () => {
    const {
      blockHandlers,
      onClickAddChild,
      onEditGroup: onEdit,
      rootBlock,
      user,
      type,
      onSelectGroup
    } = this.props;
    const sortedIds =
      type === "task"
        ? rootBlock.groupTaskContext
        : rootBlock.groupProjectContext;

    const groups = sortBlocksByPosition(rootBlock.group, sortedIds);
    const rendered: JSX.Element[] = [];

    if (
      (type === "task" && this.hasChildren(rootBlock.type)) ||
      (type === "project" && this.hasChildren(rootBlock.project))
    ) {
      let renderChildren: any = () => null;
      let props: any = {};

      if (type === "task") {
        const stat = this.getTaskStat(values(rootBlock.task));
        renderChildren = () => this.renderTasks(stat.sortedTasks, rootBlock);
        props = {
          showViewMore: stat.showViewMore,
          viewMoreCount: stat.viewMoreCount,
          onViewMore: () => onSelectGroup(rootBlock, true)
        };
      } else {
        renderChildren = () =>
          this.renderProjects(rootBlock.project, rootBlock);
      }

      const ungrouped = (
        <Group
          disabled
          key="ungrouped"
          type={type}
          group={
            {
              name: type === "task" ? "Ungrouped Tasks" : "Ungrouped Projects"
            } as IBlock
          }
          draggableId="ungrouped"
          droppableId="ungrouped"
          blockHandlers={blockHandlers}
          onClickAddChild={onClickAddChild}
          onEdit={onEdit}
          index={0}
          render={renderChildren}
          {...props}
        />
      );

      rendered.push(ungrouped);
    }

    groups.forEach((group, index) => {
      const groupId = group.customId;
      const groupProps = {
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

  public renderGroupChildren = (block, context) => {
    return (
      <DataLoader
        data={block}
        areDataSame={this.areBlocksSame}
        isDataLoaded={this.isBlockChildrenLoaded}
        loadData={this.fetchChildren}
        render={renderBlock => {
          return (
            <React.Fragment>
              {context === "task"
                ? this.renderTasks(renderBlock.task, renderBlock)
                : this.renderProjects(renderBlock.project, renderBlock)}
            </React.Fragment>
          )
        }}
      />
    );
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

const BlockThumbnailContainer = styled.div`
  margin-top: 12px;
  margin-bottom: 12px;
`;

export default KanbanBoard;
