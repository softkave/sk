import {
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";
import styled from "@emotion/styled";
import { Button, Dropdown, Menu, Modal, Space, Typography } from "antd";
import React from "react";
import { IBlock } from "../../models/block/block";
import deleteBlockOperationFunc from "../../redux/operations/block/deleteBlock";
import StyledContainer from "../styled/Container";
import { priorityToColorMap } from "./Priority";
import TaskStatusContainer from "./TaskStatusContainer";

export interface ITaskProps {
  task: IBlock;
  onEdit?: (task: IBlock) => void;
  onDelete?: (task: IBlock) => void;
}

// TODO: how do we show thelabels?

const Task: React.FC<ITaskProps> = (props) => {
  const { task, onEdit } = props;

  const onDeleteTask = () => {
    // TODO: should we show loading when deleting or cover the task with a mask?
    Modal.confirm({
      title: "Are you sure you want to delete this task?",
      okText: "Yes",
      cancelText: "No",
      okType: "primary",
      okButtonProps: { danger: true },
      onOk() {
        deleteBlockOperationFunc({ block: task });
      },
      onCancel() {
        // do nothing
      },
    });
  };

  const menu = (
    <Menu
      onClick={(evt) => {
        switch (evt.key) {
          case "edit":
            if (onEdit) {
              onEdit(task);
            }
            break;

          case "delete":
            onDeleteTask();
        }
      }}
    >
      <Menu.Item key="edit">
        <EditOutlined />
        Edit Task
      </Menu.Item>
      <Menu.Item key="delete">
        <DeleteOutlined />
        Delete Task
      </Menu.Item>
    </Menu>
  );

  const options = (
    <Dropdown overlay={menu} trigger={["click"]} placement="bottomRight">
      <Button
        icon={<EllipsisOutlined style={{ fontSize: "27px" }} />}
        style={{
          border: 0,
          padding: 0,
          backgroundColor: "inherit",
          borderRadius: 0,
          boxShadow: "none",
          height: "22px",
        }}
      />
    </Dropdown>
  );

  return (
    <StyledTask direction="vertical">
      <StyledContainer>
        <StyledContainer s={{ flex: 1 }}>
          <span style={{ color: priorityToColorMap[task.priority!] }}>
            {task.priority}
          </span>
        </StyledContainer>
        {options}
      </StyledContainer>
      <Typography.Paragraph
        ellipsis={{
          rows: 2,
          expandable: true,
        }}
        style={{ marginBottom: "0" }}
      >
        {task.description}
      </Typography.Paragraph>
      <StyledControlsContainer>
        <StyledContainer s={{ flex: 1 }}>
          <TaskStatusContainer task={task} />
        </StyledContainer>
      </StyledControlsContainer>
    </StyledTask>
  );
};

const StyledTask = styled(Space)({
  minWidth: "280px",
  width: "100%",
});

const StyledControlsContainer = styled("div")({
  display: "flex",
  width: "100%",
});

export default React.memo(Task);
