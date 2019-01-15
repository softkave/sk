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
      block: null
    };
  }

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
    return Object.keys(obj).length > 0;
  }

  getCollaborators() {
    const { user, rootBlock, collaborators } = this.props;
    return rootBlock.collaborators || collaborators || [user];
  }

  getExistingNames(blocks) {
    return Object.keys(blocks).map(block => block.name);
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
      onBack,
      parentBlock
    } = this.props;
    const { form, parent, project, block } = this.state;
    const blockTypes = ["project", "group", "task"];
    const collaborators = this.getCollaborators();
    const permission = rootBlock.acl
      ? generateBlockPermission(rootBlock, user.permissions)
      : parentPermission;

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

    return (
      <div>
        <EditProject
          noAcl={isUserRootBlock}
          visible={form.project}
          onSubmit={data => blockHandlers.onAdd(data, parent)}
          onClose={() => this.toggleForm("project")}
          data={block}
          existingProjects={this.getExistingNames(
            block ? parentBlock.projects : rootBlock.projects
          )}
        />
        <EditGroup
          noAcl={isUserRootBlock}
          visible={form.group}
          onSubmit={data => blockHandlers.onAdd(data, parent)}
          onClose={() => this.toggleForm("group")}
          data={block}
          existingGroups={this.getExistingNames(
            block ? parentBlock.groups : rootBlock.groups
          )}
        />
        <EditTask
          autoAssignTo={isUserRootBlock && user.id}
          collaborators={collaborators}
          visible={form.task}
          onSubmit={data => blockHandlers.onAdd(data, parent)}
          onClose={() => this.toggleForm("task")}
          data={block}
        />
        <div>
          {onBack && <Button onClick={onBack} icon="arrow-back" />}
          {permittedChildrenTypes.length > 0 && (
            <AddDropdownButton
              types={permittedChildrenTypes}
              label="Create"
              onClick={type => this.toggleForm(type, rootBlock)}
            />
          )}
        </div>
        <div>
          {this.hasChildren(assignedTasks) && (
            <Group name="Assigned Tasks" key="assignedTasks">
              {this.renderTasks(assignedTasks)}
            </Group>
          )}
          {this.hasChildren(rootBlock.tasks) && (
            <Group name="Ungrouped" key="ungrouped">
              {this.renderTasks(rootBlock.tasks)}
              {this.renderProjects(rootBlock.projects)}
            </Group>
          )}
          {Object.keys(rootBlock.groups).map(groupId => {
            let group = rootBlock.groups[groupId];
            return (
              <Group
                key={groupId}
                group={group}
                onClickAddChild={this.toggleForm}
                permission={permission}
                childrenType={blockTypes}
                blockHandlers={blockHandlers}
                onEdit={group => this.toggleForm("group", null, group)}
              >
                {this.renderTasks(group.tasks)}
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
