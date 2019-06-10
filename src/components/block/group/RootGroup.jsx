import React from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { Button } from "antd";
import values from "lodash/values";
import Group from "./Group.jsx";
import EditGroup from "./EditGroup.jsx";
import EditTask from "../task/EditTask.jsx";
import MiniTask from "../task/MiniTask.jsx";
import EditProject from "../project/EditProject.jsx";
import AddDropdownButton from "../../AddDropdownButton.jsx";
import ProjectThumbnail from "../project/ProjectThumbnail.jsx";
import {
  assignTask,
  getBlockValidChildrenTypes
} from "../../../models/block/utils";
import RootGroupContainer from "./RootGroupContainer";
import Collaborators from "../../collaborator/Collaborators.jsx";
import "./root-group.css";

class RootGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        task: false,
        project: false,
        group: false
      },
      project: null,
      block: null,
      parent: null,
      showCollaborators: false,
      fetchingChildren: true,
      fetchingCollaborators: true,
      fetchingCollaborationRequests: true,
      fetchChildrenError: null,
      fetchCollaboratorsError: null,
      fetchCollaborationRequestsError: null
    };
  }

  componentDidMount() {
    this.loadBlockData();
  }

  componentDidUpdate(prevProps) {
    if (this.props.rootBlock.customId !== prevProps.rootBlock.customId) {
      this.loadBlockData();
    } else {
      this.updateFetchingState();
    }
  }

  updateFetchingState() {
    const {
      fetchingChildren,
      fetchingCollaborators,
      fetchingCollaborationRequests
    } = this.state;
    let newState = {};

    if (this.areBlockChildrenLoaded() && fetchingChildren) {
      newState.fetchingChildren = false;
    }

    if (this.areBlockCollaboratorsLoaded() && fetchingCollaborators) {
      newState.fetchingCollaborators = false;
    }

    if (
      this.areBlockCollaborationRequestsLoaded() &&
      fetchingCollaborationRequests
    ) {
      newState.fetchingCollaborationRequests = false;
    }

    if (Object.keys(newState).length > 0) {
      this.setState(newState);
    }
  }

  async loadBlockData() {
    const {
      fetchingChildren,
      fetchingCollaborators,
      fetchingCollaborationRequests
    } = this.state;

    let newState = {
      fetchChildrenError: null,
      fetchCollaboratorsError: null,
      fetchCollaborationRequestsError: null
    };

    if (!this.areBlockChildrenLoaded()) {
      try {
        await this.fetchChildren();
      } catch (error) {
        newState.fetchChildrenError = error;
      }
    } else if (fetchingChildren) {
      newState.fetchingChildren = false;
    }

    if (!this.areBlockCollaboratorsLoaded()) {
      try {
        await this.fetchCollaborators();
      } catch (error) {
        newState.fetchCollaboratorsError = error;
      }
    } else if (fetchingCollaborators) {
      newState.fetchingCollaborators = false;
    }

    if (!this.areBlockCollaborationRequestsLoaded()) {
      try {
        await this.fetchCollaborationRequests();
      } catch (error) {
        newState.fetchCollaborationRequestsError = error;
      }
    } else if (fetchingCollaborationRequests) {
      newState.fetchingCollaborationRequests = false;
    }

    if (Object.keys(newState).length > 0) {
      this.setState(newState);
    }
  }

  areBlockChildrenLoaded() {
    const { rootBlock } = this.props;
    const permittedChildrenTypes = getBlockValidChildrenTypes(rootBlock);

    if (permittedChildrenTypes) {
      const typeNotLoaded = permittedChildrenTypes.find(type => {
        if (!rootBlock[type]) {
          return true;
        } else {
          return false;
        }
      });

      if (typeNotLoaded) {
        return false;
      }
    }

    return true;
  }

  areBlockCollaboratorsLoaded() {
    const { rootBlock } = this.props;
    if (rootBlock.type === "org" && !rootBlock.collaborators) {
      return false;
    }

    return true;
  }

  areBlockCollaborationRequestsLoaded() {
    const { rootBlock } = this.props;
    if (rootBlock.type === "org" && !rootBlock.collaborationRequests) {
      return false;
    }

    return true;
  }

  async fetchChildren() {
    const { rootBlock, blockHandlers } = this.props;
    await blockHandlers.getBlockChildren(rootBlock);
  }

  async fetchCollaborators() {
    const { rootBlock, blockHandlers } = this.props;
    await blockHandlers.getCollaborators(rootBlock);
  }

  async fetchCollaborationRequests() {
    const { rootBlock, blockHandlers } = this.props;
    await blockHandlers.getCollaborationRequests(rootBlock);
  }

  onSubmitData = (data, formType) => {
    const { parent, block } = this.state;

    if (block) {
      this.props.blockHandlers.onUpdate(block, data);
    } else {
      this.props.blockHandlers.onAdd(data, parent);
    }

    this.toggleForm(formType);
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
    const [parentId, blockType, blockId] = draggableId.split(".");

    if (parentId === rootBlock.customId) {
      sourceBlock = rootBlock;
    } else {
      let groupContainer = rootBlock.group;

      if (groupContainer) {
        sourceBlock = groupContainer[parentId];
      }
    }

    if (sourceBlock) {
      const typeContainer = sourceBlock[blockType];

      if (typeContainer) {
        draggedBlock = typeContainer[blockId];
      }
    }

    if (type === "GROUP") {
      destinationBlock = rootBlock;
    } else {
      let groupContainer = rootBlock.group;

      if (groupContainer) {
        destinationBlock = groupContainer[destination.droppableId];
      }
    }

    await blockHandlers.onDragAndDropBlock(
      draggedBlock,
      sourceBlock,
      destinationBlock,
      result
    );
  };

  toggleForm = (type, parent = null, block = null) => {
    this.setState(prevState => {
      return {
        parent: parent,
        block: block,
        form: { ...prevState.form, [type]: !prevState.form[type] }
      };
    });
  };

  setCurrentProject = project => {
    this.setState({ project });
  };

  toggleShowCollaborators = () => {
    this.setState(prevState => {
      return {
        showCollaborators: !prevState.showCollaborators
      };
    });
  };

  hasChildren(obj) {
    if (obj && typeof obj === "object") {
      return Object.keys(obj).length > 0;
    }

    return false;
  }

  getCollaborators() {
    const { user, rootBlock, collaborators } = this.props;
    return rootBlock.collaborators || collaborators || [user];
  }

  getExistingNames(blocks = {}) {
    return Object.keys(blocks).map(customId => blocks[customId].name);
  }

  sortBlocksByPosition(blocks = {}) {
    const blocksArray = values(blocks);
    const blocksWithPosition = [];
    const sortedBlocks = [];

    for (const block of blocksArray) {
      if (block.position && block.position >= 0) {
        blocksWithPosition.push(block);
      } else {
        sortedBlocks.push(block);
      }
    }

    blocksWithPosition.forEach(task => {
      sortedBlocks.splice(task.position, 0, task);
    });

    return sortedBlocks;
  }

  renderTasks(tasks = {}, parent) {
    const { blockHandlers, user, rootBlock } = this.props;
    const collaborators = this.getCollaborators();
    const tasksToRender = this.sortBlocksByPosition(tasks);

    return tasksToRender.map((taskId, index) => {
      const task = tasks[taskId];
      return (
        <Draggable
          key={task.customId}
          draggableId={`${parent.customId}.task.${task.customId}`}
          index={index}
        >
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              <MiniTask
                user={user}
                task={task}
                collaborators={collaborators}
                blockHandlers={blockHandlers}
                onEdit={task =>
                  this.toggleForm("task", parent || rootBlock, task)
                }
              />
            </div>
          )}
        </Draggable>
      );
    });
  }

  renderProjects(projects = {}, parent) {
    const projectsToRender = this.sortBlocksByPosition(projects);

    return projectsToRender.map((projectId, index) => {
      const project = projects[projectId];
      return (
        <Draggable
          key={project.customId}
          draggableId={`${parent.customId}.project.${project.customId}`}
          index={index}
        >
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              <ProjectThumbnail
                project={project}
                onClick={() => this.setCurrentProject(project)}
                className="sk-root-group-thumbnail"
              />
            </div>
          )}
        </Draggable>
      );
    });
  }

  renderDraggable({ children, draggableProps, getDivProps }) {
    return (
      <Draggable {...draggableProps}>
        {(provided, snapshot) => {
          const divProps = getDivProps && getDivProps(provided, snapshot);
          return (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              {...divProps}
            >
              {children}
            </div>
          );
        }}
      </Draggable>
    );
  }

  renderDroppable({ children, droppableProps, getDivProps }) {
    return (
      <Droppable {...droppableProps}>
        {(provided, snapshot) => {
          const divProps = getDivProps && getDivProps(provided, snapshot);
          return (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              {...divProps}
            >
              {children}
              {provided.placeholder}
            </div>
          );
        }}
      </Droppable>
    );
  }

  render() {
    const { rootBlock, blockHandlers, user, onBack, isFromRoot } = this.props;
    const {
      form,
      project,
      block,
      showCollaborators,
      parent,
      fetchingChildren,
      fetchingCollaborators,
      fetchingCollaborationRequests,
      fetchChildrenError,
      fetchCollaboratorsError,
      fetchCollaborationRequestsError
    } = this.state;

    if (fetchChildrenError) {
      return (
        <React.Fragment>
          <p style={{ color: "red" }}>
            {fetchChildrenError.message || "An error occurred"}
          </p>
          <p>Please reload the page</p>
        </React.Fragment>
      );
    }

    const collaborators = this.getCollaborators();
    const childrenTypes = getBlockValidChildrenTypes(rootBlock);
    const isUserRootBlock = rootBlock.type === "root";
    const actLikeRootBlock =
      isFromRoot !== undefined ? isFromRoot : isUserRootBlock ? true : false;

    if (showCollaborators) {
      return (
        <Collaborators
          error={fetchCollaboratorsError || fetchCollaborationRequestsError}
          block={rootBlock}
          onBack={this.toggleShowCollaborators}
          collaborators={rootBlock.collaborators}
          onAddCollaborators={data => {
            blockHandlers.onAddCollaborators(rootBlock, data);
          }}
          collaborationRequests={rootBlock.collaborationRequests}
          bench={rootBlock.bench}
          onUpdateCollaborator={(collaborator, data) => {
            blockHandlers.onUpdateCollaborator(rootBlock, collaborator, data);
          }}
        />
      );
    }

    if (project) {
      return (
        <RootGroupContainer
          path={project.path}
          collaborators={collaborators}
          user={user}
          onBack={() => this.setCurrentProject(null)}
          blockHandlers={blockHandlers}
          parentBlock={rootBlock}
          isFromRoot={actLikeRootBlock || isFromRoot}
        />
      );
    }

    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <div className="sk-root-group">
          <EditProject
            visible={form.project}
            onSubmit={data => this.onSubmitData(data, "project")}
            onClose={() => this.toggleForm("project")}
            data={block}
            existingProjects={
              form.project && this.getExistingNames(parent.project)
            }
          />
          <EditGroup
            visible={form.group}
            onSubmit={data => this.onSubmitData(data, "group")}
            onClose={() => this.toggleForm("group")}
            data={block}
            existingGroups={form.group && this.getExistingNames(parent.group)}
          />
          <EditTask
            defaultAssignedTo={actLikeRootBlock && [assignTask(user)]}
            collaborators={collaborators}
            visible={form.task}
            onSubmit={data => this.onSubmitData(data, "task")}
            onClose={() => this.toggleForm("task")}
            data={block}
            user={user}
          />
          <div className="sk-root-group-header">
            {onBack && (
              <Button
                onClick={onBack}
                icon="arrow-left"
                style={{ marginRight: "1em" }}
              />
            )}
            {childrenTypes.length > 0 && (
              <AddDropdownButton
                types={childrenTypes}
                label="Create"
                onClick={type => this.toggleForm(type, rootBlock)}
              />
            )}
            {rootBlock.type === "org" &&
              (fetchingCollaborators && fetchingCollaborationRequests ? (
                "Loading"
              ) : (
                <Button
                  style={{ marginLeft: "1em" }}
                  onClick={this.toggleShowCollaborators}
                >
                  Collaborators
                </Button>
              ))}
            <span className="sk-root-group-name">
              {isUserRootBlock ? "Root" : rootBlock.name}
            </span>
          </div>
          <div className="sk-root-group-content">
            <div className="sk-root-group-content-inner">
              <Droppable
                droppableId={rootBlock.customId}
                type="GROUP"
                direction="horizontal"
              >
                {(provided, snapshot) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {fetchingChildren && "Loading"}
                    {(this.hasChildren(rootBlock.task) ||
                      this.hasChildren(rootBlock.project)) && (
                      <Draggable
                        isDragDisabled
                        key="ungrouped-draggable"
                        draggableId="ungrouped-draggable"
                        index={0}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <Droppable droppableId={rootBlock.customId}>
                              {(provided, snapshot) => (
                                <div
                                  {...provided.droppableProps}
                                  ref={provided.innerRef}
                                  className="sk-root-group-content-group"
                                >
                                  <Group name="Ungrouped" user={user}>
                                    {this.renderTasks(
                                      rootBlock.task,
                                      rootBlock
                                    )}
                                    {this.renderProjects(
                                      rootBlock.project,
                                      rootBlock
                                    )}
                                  </Group>
                                  {provided.placeholder}
                                </div>
                              )}
                            </Droppable>
                          </div>
                        )}
                      </Draggable>
                    )}
                    {this.hasChildren(rootBlock.group) &&
                      Object.keys(rootBlock.group).map((groupId, index) => {
                        let group = rootBlock.group[groupId];
                        return (
                          <Draggable
                            key={groupId}
                            draggableId={`${
                              rootBlock.customId
                            }.group.${groupId}`}
                            index={index + 1}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <Droppable droppableId={groupId}>
                                  {(provided, snapshot) => (
                                    <div
                                      {...provided.droppableProps}
                                      ref={provided.innerRef}
                                      className="sk-root-group-content-group"
                                    >
                                      <Group
                                        group={group}
                                        onClickAddChild={this.toggleForm}
                                        blockHandlers={blockHandlers}
                                        onEdit={group =>
                                          this.toggleForm(
                                            "group",
                                            rootBlock,
                                            group
                                          )
                                        }
                                        user={user}
                                      >
                                        {this.renderTasks(group.task, group)}
                                        {this.renderProjects(
                                          group.project,
                                          group
                                        )}
                                      </Group>
                                      {provided.placeholder}
                                    </div>
                                  )}
                                </Droppable>
                              </div>
                            )}
                          </Draggable>
                        );
                      })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          </div>
        </div>
      </DragDropContext>
    );
  }
}

export default RootGroup;
