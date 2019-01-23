import React from "react";
import { Button, Switch, Row, Col } from "antd";
import Priority from "./Priority.jsx";
import "./minitask.css";

class Task extends React.Component {
  getCollaborator() {
    const { task, user } = this.props;
    if (task.collaborators) {
      return task.collaborators.find(
        collaborator => collaborator.id === user.id
      );
    }
  }

  render() {
    const { task, blockHandlers, onEdit } = this.props;
    console.log("mini task", this.props);
    const collaborator = this.getCollaborator();
    return (
      <div className="sk-minitask">
        <Row>
          <Col span={4}>
            <Switch
              checked={collaborator && collaborator.data}
              onChange={() => blockHandlers.onToggle(task)}
            />
          </Col>
          <Col span={16} className="sk-minitask-priority">
            <Priority level={task.priority} />
          </Col>
          <Col span={4} className="sk-minitask-top-extra">
            <Button
              icon="close"
              className="sk-minitask-close"
              onClick={() => blockHandlers.onDelete(task)}
            />
          </Col>
        </Row>
        <Row className="sk-minitask-desc">
          <Col span={16}>
            <p>{task.description}</p>
          </Col>
        </Row>
        <Row>
          <Col span={24} className="sk-minitask-footer-right">
            <Button icon="edit" onClick={() => onEdit(task)} />
          </Col>
        </Row>
      </div>
    );
  }
}

export default Task;
