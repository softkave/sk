import { Button, Col, Row, Spin, Switch, Tooltip } from "antd";
import React from "react";

import { IBlock } from "../../../models/block/block";
import { IUser } from "../../../models/user/user";
import DeleteButton from "../../DeleteButton";
import { IBlockMethods } from "../methods";
import "./minitask.css";
import Priority from "./Priority";

export interface ITaskProps {
  task: IBlock;
  user: IUser;
  blockHandlers: IBlockMethods;
  onEdit: (task: IBlock) => void;
}

interface ITaskState {
  toggleLoading: boolean;
  toggleLoadingError?: string;
}

class Task extends React.PureComponent<ITaskProps, ITaskState> {
  public state = {
    toggleLoading: false,
    toggleLoadingError: undefined
  };

  public getUserTaskCollaboratorData() {
    const { task, user } = this.props;
    if (task.taskCollaborators) {
      return task.taskCollaborators.find(
        collaborator => collaborator.userId === user.customId
      );
    }
  }

  public toggleChecked = async () => {
    try {
      const { task, blockHandlers, user } = this.props;

      this.setState({ toggleLoading: true });
      await blockHandlers.onToggle({ user, block: task });
      this.setState({ toggleLoading: false });
    } catch (error) {
      this.setState({
        toggleLoading: false,

        // TODO: Use server returned error message
        toggleLoadingError: "An error occurred"
      });
    }
  };

  public render() {
    const { task, blockHandlers, onEdit } = this.props;
    const { toggleLoading, toggleLoadingError } = this.state;
    const collaborator = this.getUserTaskCollaboratorData();

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
                />
              </Spin>
            ) : (
              <Tooltip
                title={
                  <React.Fragment>
                    <p style={{ color: "red" }}>
                      {toggleLoadingError} <br /> Please reload the page.
                    </p>
                  </React.Fragment>
                }
              >
                <Button icon="close" type="danger" />
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
                onDelete={() => blockHandlers.onDelete({ block: task })}
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
