import React from "react";
import Group from "./Group.jsx";
import EditGroup from "./EditGroup.jsx";
import EditTask from "../task/EditTask.jsx";
import MiniTask from "../task/MiniTask.jsx";
import EditProject from "../project/EditProject.jsx";
//import Project from "../project/Project.jsx";
import AddDropdownButton from "../AddDropdownButton.jsx";
import { generateBlockPermission } from "../../models/acl";
import ProjectThumbnail from "../project/ProjectThumbnail.jsx";
import { Button } from "antd";
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
      parent: null
    };
  }

  onSubmitData = (data, formType) => {
    const { parent, block } = this.state;
    console.log(data, formType, parent, block);
    if (block) {
      this.props.blockHandlers.onUpdate(block, data);
    } else {
      this.props.blockHandlers.onAdd(data, parent);
    }

    this.toggleForm(formType);
  };

  toggleForm = (type, parent, block) => {
    this.setState(prevState => {
      return {
        parent: parent || null,
        block: block || null,
        form: { ...prevState.form, [type]: !prevState.form[type] }
      };
    });
  };

  setCurrentProject = project => {
    this.setState({ project });
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
    return Object.keys(blocks).map(id => blocks[id].name);
  }

  renderTasks(tasks = {}, permission) {
    const { blockHandlers } = this.props;
    const collaborators = this.getCollaborators();
    return Object.keys(tasks).map(taskId => {
      const task = tasks[taskId];
      return (
        <MiniTask
          key={task.id}
          task={task}
          permission={permission}
          collaborators={collaborators}
          blockHandlers={blockHandlers}
          onEdit={task => this.toggleForm("task", null, task)}
        />
      );
    });
  }

  renderProjects(projects = {}) {
    return Object.keys(projects).map(projectId => {
      const project = projects[projectId];
      return (
        <ProjectThumbnail
          key={project.id}
          project={project}
          onClick={() => this.setCurrentProject(project)}
          className="sk-root-group-thumbnail"
        />
      );
    });
  }

  render() {
    const {
      assignedTasks,
      rootBlock,
      blockHandlers,
      user,
      parentPermission,
      onBack
      // parentBlock - not supported yet, for self updating
    } = this.props;
    console.log("root group", this.props, this.state);
    const { form, project, block } = this.state;
    const blockTypes = ["project", "group", "task"];
    const collaborators = this.getCollaborators();
    const permission = rootBlock.acl
      ? generateBlockPermission(rootBlock, user.permissions)
      : parentPermission;

    console.log(permission);

    if (project) {
      return (
        <RootGroup
          rootBlock={project}
          parentPermission={permission}
          collaborators={collaborators}
          user={user}
          onBack={() => this.setCurrentProject(null)}
          blockHandlers={blockHandlers}
          parentBlock={rootBlock}
        />
      );
    }

    const isUserRootBlock = rootBlock.type === "root" ? true : false;
    const permittedChildrenTypes = blockTypes.filter(
      type =>
        type !== rootBlock.type && permission[type] && permission[type].create
    );

    const assignedTasksPermission = {
      task: {
        toggle: true
      }
    };

    return (
      <div className="sk-root-group">
        <EditProject
          noAcl={isUserRootBlock}
          visible={form.project}
          onSubmit={data => this.onSubmitData(data, "project")}
          onClose={() => this.toggleForm("project")}
          data={block}
          existingProjects={
            form.project && this.getExistingNames(rootBlock.projects)
          }
        />
        <EditGroup
          noAcl={isUserRootBlock}
          visible={form.group}
          onSubmit={data => this.onSubmitData(data, "group")}
          onClose={() => this.toggleForm("group")}
          data={block}
          existingGroups={form.group && this.getExistingNames(rootBlock.groups)}
        />
        <EditTask
          autoAssignTo={isUserRootBlock && user.id}
          collaborators={collaborators}
          visible={form.task}
          onSubmit={data => this.onSubmitData(data, "task")}
          onClose={() => this.toggleForm("task")}
          data={block}
        />
        <div className="sk-root-group-header">
          {onBack && (
            <Button
              onClick={onBack}
              icon="arrow-left"
              style={{ marginRight: "1em" }}
            />
          )}
          {permittedChildrenTypes.length > 0 && (
            <AddDropdownButton
              types={permittedChildrenTypes}
              label="Create"
              onClick={type => this.toggleForm(type, rootBlock)}
            />
          )}
        </div>
        <div className="sk-root-group-content">
          {this.hasChildren(assignedTasks) && (
            <Group name="Assigned Tasks" key="assignedTasks">
              {this.renderTasks(assignedTasks, assignedTasksPermission)}
            </Group>
          )}
          {(this.hasChildren(rootBlock.tasks) ||
            this.hasChildren(rootBlock.projects)) && (
            <Group name="Ungrouped" key="ungrouped">
              {this.renderTasks(rootBlock.tasks, permission)}
              {this.renderProjects(rootBlock.projects)}
            </Group>
          )}
          {this.hasChildren(rootBlock.groups) &&
            Object.keys(rootBlock.groups).map(groupId => {
              let group = rootBlock.groups[groupId];
              return (
                <Group
                  key={groupId}
                  group={group}
                  onClickAddChild={this.toggleForm}
                  permission={permission}
                  childrenTypes={permittedChildrenTypes}
                  blockHandlers={blockHandlers}
                  onEdit={group => this.toggleForm("group", null, group)}
                >
                  {this.renderTasks(group.tasks, permission)}
                  {this.renderProjects(group.projects)}
                </Group>
              );
            })}
        </div>
      </div>
    );
  }
}

export default RootGroup;
