import styled from "@emotion/styled";
import { Button, Col, Row } from "antd";
import React from "react";
import { IBlock } from "../../models/block/block";
import DeleteButton from "../DeleteButton";
import Priority from "./Priority";
import ToggleSwitchContainer from "./ToggleSwitchContainer";

import deleteBlockOperationFunc from "../../redux/operations/block/deleteBlock";
import "./task.css";

export interface ITaskProps {
  task: IBlock;
  onEdit?: (task: IBlock) => void;
}

const Task: React.SFC<ITaskProps> = props => {
  const { task, onEdit } = props;

  const onDeleteTask = () => {
    deleteBlockOperationFunc({ block: task });
  };

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
          {onEdit && (
            <Button
              icon="edit"
              onClick={() => onEdit(task)}
              title="edit task"
            />
          )}
          <span style={{ marginLeft: "4px" }}>
            <DeleteButton
              deleteButton={
                <Button
                  icon="delete"
                  type="danger"
                  className="sk-minitask-close"
                />
              }
              onDelete={onDeleteTask}
              title="Are you sure you want to delete this task?"
            />
          </span>
        </Col>
      </Row>
    </div>
  );
};

export default Task;

const StyledTaskDescription = styled.p({
  padding: 0
});
