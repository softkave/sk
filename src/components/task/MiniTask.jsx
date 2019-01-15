import React from "react";
import { Button, Switch, Row, Col } from "antd";
import Priority from "./Priority.jsx";

class Task extends React.Component {
  getCollaborator() {
    const { task, user } = this.props;
    return task.collaborators.find(collaborator => collaborator.id === user.id);
  }

  render() {
    const { task, blockHandlers, onEdit } = this.props;
    const collaborator = this.getCollaborator();
    return (
      <div>
        <Row>
          <Col span={4}>
            <Switch
              checked={collaborator.data}
              onChange={() => blockHandlers.onToggle(task)}
            />
          </Col>
          <Col span={16}>
            <Priority level={task.prority} />
          </Col>
          <Col span={4}>
            <Button icon="close" onClick={() => blockHandlers.onDelete(task)} />
          </Col>
        </Row>
        <Row>
          <Col span={16}>
            <p>{task.description}</p>
          </Col>
        </Row>
        <Row>
          <Col span={4}>
            <Button icon="edit" onClick={() => onEdit(task)} />
          </Col>
        </Row>
      </div>
    );
  }
}

export default Task;
