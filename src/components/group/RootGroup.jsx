import React from "react";
import Group from "./Group.jsx";
import EditGroup from "./EditGroup.jsx";
import EditTask from "../task/EditTask.jsx";
import MiniTask from "../task/MiniTask.jsx";
import EditProject from "../project/EditProject.jsx";
import AddDropdownButton from "../AddDropdownButton.jsx";
import ProjectThumbnail from "../project/ProjectThumbnail.jsx";
import { Button } from "antd";
import {
  assignTask,
  permittedChildrenTypes
} from "../../models/block/block-utils";
import RootGroupGenericContainer from "./RootGroupGenericContainer.jsx";
import Collaborators from "../collaborator/Collaborators.jsx";
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
      fetchingCollaborationRequests: true
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

  loadBlockData() {
    const {
      fetchingChildren,
      fetchingCollaborators,
      fetchingCollaborationRequests
    } = this.state;
    let newState = {};

    if (!this.areBlockChildrenLoaded()) {
      this.fetchChildren();
    } else if (fetchingChildren) {
      newState.fetchingChildren = false;
    }

    if (!this.areBlockCollaboratorsLoaded()) {
      this.fetchCollaborators();
    } else if (fetchingCollaborators) {
      newState.fetchingCollaborators = false;
    }

    if (!this.areBlockCollaborationRequestsLoaded()) {
      this.fetchCollaborationRequests();
    } else if (fetchingCollaborationRequests) {
      newState.fetchingCollaborationRequests = false;
    }

    if (Object.keys(newState).length > 0) {
      this.setState(newState);
    }
  }

  areBlockChildrenLoaded() {
    const { rootBlock } = this.props;

    if (permittedChildrenTypes[rootBlock.type]) {
      const typeNotLoaded = permittedChildrenTypes[rootBlock.type].find(
        type => {
          if (!rootBlock[type]) {
            return true;
          }
        }
      );

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

  renderTasks(tasks = {}, parent) {
    const { blockHandlers, user, rootBlock } = this.props;
    const collaborators = this.getCollaborators();
    return Object.keys(tasks).map(taskId => {
      const task = tasks[taskId];
      return (
        <MiniTask
          user={user}
          key={task.customId}
          task={task}
          collaborators={collaborators}
          blockHandlers={blockHandlers}
          onEdit={task => this.toggleForm("task", parent || rootBlock, task)}
        />
      );
    });
  }

  renderProjects(projects = {}) {
    return Object.keys(projects).map(projectId => {
      const project = projects[projectId];
      return (
        <ProjectThumbnail
          key={project.customId}
          project={project}
          onClick={() => this.setCurrentProject(project)}
          className="sk-root-group-thumbnail"
        />
      );
    });
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
      fetchingCollaborationRequests
    } = this.state;
    const collaborators = this.getCollaborators();
    const childrenTypes = permittedChildrenTypes[rootBlock.type];
    const isUserRootBlock =
      isFromRoot !== undefined
        ? isFromRoot
        : rootBlock.type === "root"
        ? true
        : false;

    if (showCollaborators) {
      return (
        <Collaborators
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
        <RootGroupGenericContainer
          path={project.path}
          collaborators={collaborators}
          user={user}
          onBack={() => this.setCurrentProject(null)}
          blockHandlers={blockHandlers}
          parentBlock={rootBlock}
          isFromRoot={isUserRootBlock || isFromRoot}
        />
      );
    }

    return (
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
          defaultAssignedTo={isFromRoot && [assignTask(user)]}
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
            {fetchingChildren && "Loading"}
            {(this.hasChildren(rootBlock.task) ||
              this.hasChildren(rootBlock.project)) && (
              <div className="sk-root-group-content-group" key="ungrouped">
                <Group name="Ungrouped" user={user}>
                  {this.renderTasks(rootBlock.task, rootBlock)}
                  {this.renderProjects(rootBlock.project)}
                </Group>
              </div>
            )}
            {this.hasChildren(rootBlock.group) &&
              Object.keys(rootBlock.group).map(groupId => {
                let group = rootBlock.group[groupId];
                return (
                  <div className="sk-root-group-content-group" key={groupId}>
                    <Group
                      group={group}
                      onClickAddChild={this.toggleForm}
                      blockHandlers={blockHandlers}
                      onEdit={group =>
                        this.toggleForm("group", rootBlock, group)
                      }
                      user={user}
                    >
                      {this.renderTasks(group.task, group)}
                      {this.renderProjects(group.project)}
                    </Group>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    );
  }
}

export default RootGroup;
