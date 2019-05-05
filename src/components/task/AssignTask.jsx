import React from "react";
import TaskCollaborator from "./TaskCollaborator.jsx";
import { Form, Select } from "antd";
import dotProp from "dot-prop-immutable";
import CollaboratorThumbnail from "../collaborator/Thumnail.jsx";

export default class AssignTask extends React.Component {
  constructor(props) {
    super(props);
    this.existingTaskCollaboratorsIdMap = {};
    this.collaboratorsIdMap = {};
    const defaultTaskCollaborators = props.defaultTaskCollaborators || [];
    defaultTaskCollaborators.forEach(c => {
      this.existingTaskCollaboratorsIdMap[c.userId] = c;
    });

    const collaborators = props.collaborators || [];
    collaborators.forEach(c => {
      this.collaboratorsIdMap[c.customId] = c;
    });

    this.error = null;
  }

  onAddCollaborator = collaborator => {
    const { form, user } = this.props;
    if (this.existingTaskCollaboratorsIdMap[collaborator.customId]) {
      this.error = "collaborator is already assigned";
      return;
    }

    let collaborators = form.getFieldValue("taskCollaborators");
    collaborators.push({
      userId: collaborator.customId,
      assignedAt: Date.now(),
      completedAt: 0,
      assignedBy: user.customId
    });

    this.error = null;
    this.existingTaskCollaboratorsIdMap[collaborator.customId] = collaborator;
    form.setFieldsValue({ taskCollaborators: collaborators });
  };

  onUnassignCollaborator = (collaborator, index) => {
    const { form } = this.props;

    if (!this.existingTaskCollaboratorsIdMap[collaborator.userId]) {
      this.error = "collaborator is not assigned";
      return;
    }

    let collaborators = form.getFieldValue("taskCollaborators");
    collaborators = dotProp.delete(collaborators, `${index}`);
    this.error = null;
    delete this.existingTaskCollaboratorsIdMap[collaborator.userId];
    form.setFieldsValue({ taskCollaborators: collaborators });
  };

  renderSelectCollaborators(collaborators) {
    let options = [];

    collaborators.forEach((c, index) => {
      if (!this.existingTaskCollaboratorsIdMap[c.customId]) {
        options.push(
          <Select.Option value={index} key={c.customId}>
            <CollaboratorThumbnail collaborator={c} />
          </Select.Option>
        );
      }
    });

    return options.length > 0 ? (
      <Form.Item>
        <Select
          placeholder="Assign collaborator"
          onChange={i => {
            this.onAddCollaborator(collaborators[i]);
          }}
        >
          {options}
        </Select>
      </Form.Item>
    ) : null;
  }

  renderCollaborators(taskCollaborators) {
    return taskCollaborators.map((c, i) => {
      return (
        <TaskCollaborator
          key={c.userId}
          collaborator={this.collaboratorsIdMap[c.userId]}
          collaboratorTaskData={c}
          onToggle={null}
          onUnassign={() => this.onUnassignCollaborator(c, i)}
        />
      );
    });
  }

  render() {
    const { form, collaborators, defaultTaskCollaborators } = this.props;

    form.getFieldDecorator("taskCollaborators", {
      initialValue: defaultTaskCollaborators || []
    });

    const taskCollaborators = form.getFieldValue("taskCollaborators");
    return (
      <div>
        {this.renderCollaborators(taskCollaborators)}
        {this.renderSelectCollaborators(collaborators)}
      </div>
    );
  }
}
