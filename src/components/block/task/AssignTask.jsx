import React from "react";
import { Form, Select, Button } from "antd";

import TaskCollaboratorThumbnail from "./TaskCollaboratorThumbnail";
import CollaboratorThumbnail from "../../collaborator/Thumnail.jsx";
import { indexArray } from "../../../utils/object";

export default class AssignTask extends React.PureComponent {
  static defaultProps = {
    collaborators: [],
    value: []
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

  renderCollaboratorOptions(collaborators = [], user) {
    let options = collaborators.map((collaborator, index) => {
      return (
        <Select.Option value={index} key={collaborator.customId}>
          <CollaboratorThumbnail collaborator={collaborator} />
        </Select.Option>
      );
    });

    return (
      <Form.Item label="Select Collaborator">
        <Select
          placeholder="Assign Collaborator"
          value={undefined}
          onChange={i => {
            this.onAssignCollaborator(collaborators[i]);
          }}
        >
          {options}
        </Select>
        <Button block onClick={() => this.onAssignCollaborator(user)}>
          Assign To Me
        </Button>
      </Form.Item>
    );
  }

  renderTaskCollaborators(taskCollaborators = []) {
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
    console.log(this);

    return (
      <div>
        {this.renderTaskCollaborators(value)}
        {this.renderCollaboratorOptions(collaborators, user)}
        {/* <Form.Item>
          <Button block onClick={() => this.onAssignCollaborator(user)}>
            Assign To Me
          </Button>
        </Form.Item> */}
      </div>
    );
  }
}
