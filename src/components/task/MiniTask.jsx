import React from "react";
import { Button, Switch, Row, Col } from "antd";
import Priority from "./Priority.jsx";
import { canPerformAction } from "../../models/block/acl";
import "./minitask.css";

class Task extends React.Component {
  getCollaborator() {
    const { task, user } = this.props;
    if (task.collaborators) {
      return task.collaborators.find(
        collaborator => collaborator.userId === user.id
      );
    }
  }

  render() {
    const { task, blockHandlers, onEdit, permission } = this.props;
    console.log("mini task", this.props);
    const collaborator = this.getCollaborator();
    return (
      <div className="sk-minitask">
        <Row>
          <Col span={4}>
            {canPerformAction(task, permission, "TOGGLE_TASK") && (
              <Switch
                checked={collaborator && !!collaborator.completedAt}
                onChange={() => blockHandlers.onToggle(task)}
                disabled={collaborator ? false : true}
                title={
                  collaborator ? "toggle task" : "task is not yet assigned"
                }
              />
            )}
          </Col>
          <Col span={16} className="sk-minitask-priority">
            <Priority level={task.priority} cover />
          </Col>
          <Col span={4} className="sk-minitask-top-extra">
            {canPerformAction(task, permission, "DELETE_TASK") && (
              <Button
                icon="close"
                className="sk-minitask-close"
                onClick={() => blockHandlers.onDelete(task)}
                title="delete task"
              />
            )}
          </Col>
        </Row>
        <Row className="sk-minitask-desc">
          <Col span={16} offset={4}>
            <p>{task.description}</p>
          </Col>
        </Row>
        <Row>
          <Col span={24} className="sk-minitask-footer-right">
            {canPerformAction(task, permission, "UPDATE_TASK") && (
              <Button
                icon="edit"
                onClick={() => onEdit(task)}
                title="edit task"
              />
            )}
          </Col>
        </Row>
      </div>
    );
  }
}

export default Task;
