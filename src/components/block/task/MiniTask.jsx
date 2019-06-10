import React from "react";
import { Button, Switch, Row, Col, Spin, Icon, Tooltip } from "antd";
import Priority from "./Priority.jsx";
import DeleteButton from "../../DeleteButton";
import "./minitask.css";

class Task extends React.Component {
  state = {
    toggleLoading: false,
    toggleLoadingError: null
  };

  getCollaborator() {
    const { task, user } = this.props;
    if (task.taskCollaborators) {
      return task.taskCollaborators.find(
        collaborator => collaborator.userId === user.customId
      );
    }
  }

  toggleChecked = async () => {
    try {
      const { task, blockHandlers } = this.props;
      this.setState({ toggleLoading: true });
      await blockHandlers.onToggle(task);
      this.setState({ toggleLoading: false });
    } catch (error) {
      this.setState({
        toggleLoading: false,
        toggleLoadingError: error
      });
    }
  };

  render() {
    const { task, blockHandlers, onEdit } = this.props;
    const { toggleLoading, toggleLoadingError } = this.state;
    const collaborator = this.getCollaborator();

    return (
      <div className="sk-minitask">
        <Row>
          <Col span={4}>
            {!toggleLoadingError ? (
              <Spin spinning={toggleLoading}>
                <Switch
                  checked={collaborator && !!collaborator.completedAt}
                  onChange={this.toggleChecked}
                  disabled={collaborator ? false : true}
                  title={collaborator ? "toggle task" : null}
                />
              </Spin>
            ) : (
              <Tooltip
                title={
                  <React.Fragment>
                    <p style={{ color: "red" }}>
                      {toggleLoadingError.message || "An error occurred"}
                    </p>
                    <p>Please reload the page</p>
                  </React.Fragment>
                }
              >
                <Icon type="close" />
              </Tooltip>
            )}
          </Col>
          <Col span={20} className="sk-minitask-priority">
            <Priority level={task.priority} cover />
          </Col>
        </Row>
        <Row className="sk-minitask-desc">
          <Col span={24} offset={0}>
            <p>{task.description}</p>
          </Col>
        </Row>
        <Row>
          <Col span={24} className="sk-minitask-footer-right">
            <Button
              icon="edit"
              onClick={() => onEdit(task)}
              title="edit task"
            />
            <span style={{ marginLeft: "4px" }}>
              <DeleteButton
                deleteButton={
                  <Button
                    icon="delete"
                    type="danger"
                    className="sk-minitask-close"
                  />
                }
                onDelete={() => blockHandlers.onDelete(task)}
                title="Are you sure you want to delete this task?"
              />
            </span>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Task;
