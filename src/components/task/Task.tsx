import styled from "@emotion/styled";
import { Button, Col, Row } from "antd";
import React from "react";
import { IBlock } from "../../models/block/block";
import { IUser } from "../../models/user/user";
import { IBlockMethods } from "../block/methods";
import DeleteButton from "../DeleteButton";
import Priority from "./Priority";
import ToggleSwitchContainer from "./ToggleSwitchContainer";

import "./task.css";

export interface ITaskProps {
  task: IBlock;
  user: IUser;
  blockHandlers: IBlockMethods;
  onEdit: (task: IBlock) => void;
}

class Task extends React.PureComponent<ITaskProps> {
  public render() {
    const { task, blockHandlers, onEdit } = this.props;

    return (
      <div className="sk-minitask">
        <Row>
          <Col span={4}>
            <ToggleSwitchContainer task={task} />
          </Col>
          <Col span={20} className="sk-minitask-priority">
            <Priority level={task.priority} cover />
          </Col>
        </Row>
        <Row className="sk-minitask-desc">
          <Col span={24} offset={0}>
            <StyledTaskDescription>{task.description}</StyledTaskDescription>
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

const StyledTaskDescription = styled.p({
  padding: 0
});
