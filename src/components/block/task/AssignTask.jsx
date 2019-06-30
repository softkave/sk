import React from "react";
import { Form, Select, Button } from "antd";

import TaskCollaboratorThumbnail from "./TaskCollaboratorThumbnail";
import CollaboratorThumbnail from "../../collaborator/Thumnail.jsx";
import { indexArray } from "../../../utils/object";

export default class AssignTask extends React.Component {
  static defaultProps = {
    collaborators: []
  };

  constructor(props) {
    super(props);
    this.indexedCollaborators = indexArray(props.collaborators, {
      path: "customId"
    });
  }

  onAssignCollaborator = collaborator => {
    const { value, user, onChange } = this.props;
    const collaboratorExists = !!value.find(collaboratorData => {
      return collaborator.customId === collaboratorData.userId;
    });

    if (!collaboratorExists) {
      value.push({
        userId: collaborator.customId,
        assignedAt: Date.now(),
        completedAt: 0,
        assignedBy: user.customId
      });

      onChange(value);
    }
  };

  onUnassignCollaborator = (collaborator, index) => {
    const { value, onChange } = this.props;

    value.splice(index, 1);
    onChange(value);
  };

  renderCollaboratorOptions(collaborators) {
    let options = collaborators.map((collaborator, index) => {
      return (
        <Select.Option value={index} key={collaborator.customId}>
          <CollaboratorThumbnail collaborator={collaborator} />
        </Select.Option>
      );
    });

    return (
      <Form.Item>
        <Select
          placeholder="Assign collaborator"
          onChange={i => {
            this.onAssignCollaborator(collaborators[i]);
          }}
        >
          {options}
        </Select>
      </Form.Item>
    );
  }

  renderTaskCollaborators(taskCollaborators) {
    return taskCollaborators.map((taskCollaborator, index) => {
      return (
        <TaskCollaboratorThumbnail
          key={taskCollaborator.userId}
          collaborator={this.indexedCollaborators[taskCollaborator.userId]}
          taskCollaborator={taskCollaborator}
          onToggle={null}
          onUnassign={() =>
            this.onUnassignCollaborator(taskCollaborator, index)
          }
        />
      );
    });
  }

  render() {
    const { collaborators, value, user } = this.props;

    return (
      <div>
        {this.renderTaskCollaborators(value)}
        {this.renderCollaboratorOptions(collaborators)}
        <Form.Item>
          <Button block onClick={() => this.onAssignCollaborator(user)}>
            Assign To Me
          </Button>
        </Form.Item>
      </div>
    );
  }
}
