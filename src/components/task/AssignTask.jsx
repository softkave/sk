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
      this.collaboratorsIdMap[c.id] = c;
    });

    this.error = null;
  }

  onAddCollaborator = collaborator => {
    const { form, user } = this.props;
    if (this.existingTaskCollaboratorsIdMap[collaborator.id]) {
      this.error = "collaborator is already assigned";
      return;
    }

    let collaborators = form.getFieldValue("collaborators");
    collaborators.push({
      userId: collaborator.id,
      assignedAt: Date.now(),
      completedAt: null,
      assignedBy: user.id
    });

    this.error = null;
    this.existingTaskCollaboratorsIdMap[collaborator.id] = collaborator;
    form.setFieldsValue({ collaborators });
  };

  onUnassignCollaborator = (collaborator, index) => {
    const { form } = this.props;

    if (!this.existingTaskCollaboratorsIdMap[collaborator.userId]) {
      this.error = "collaborator is not assigned";
      return;
    }

    let collaborators = form.getFieldValue("collaborators");
    collaborators = dotProp.delete(collaborators, `${index}`);
    this.error = null;
    delete this.existingTaskCollaboratorsIdMap[collaborator.userId];
    form.setFieldsValue({ collaborators });
  };

  renderSelectCollaborators(collaborators) {
    let options = [];

    collaborators.forEach((c, index) => {
      if (!this.existingTaskCollaboratorsIdMap[c.id]) {
        options.push(
          <Select.Option value={index} key={c.id}>
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

    form.getFieldDecorator("collaborators", {
      initialValue: defaultTaskCollaborators || []
    });

    const taskCollaborators = form.getFieldValue("collaborators");
    return (
      <div>
        {this.renderCollaborators(taskCollaborators)}
        {this.renderSelectCollaborators(collaborators)}
      </div>
    );
  }
}
