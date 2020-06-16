import {
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";
import { Button, Dropdown, Menu, Modal, Space, Typography } from "antd";
import React from "react";
import { IBlock, IBlockStatus } from "../../models/block/block";
import { IUser } from "../../models/user/user";
import deleteBlockOperationFunc from "../../redux/operations/block/deleteBlock";
import StyledContainer from "../styled/Container";
import { priorityToColorMap } from "./Priority";
import TaskStatusContainer from "./TaskStatusContainer";
import TaskThumbnailAssignees from "./TaskThumbnailAssignees";
import TaskThumbnailDueDate from "./TaskThumbnailDueDate";
import TaskThumbnailSubTasks from "./TaskThumbnailSubTasks";

const ignoreClassNames = ["ant-typography-expand", "task-menu-dropdown"];

export interface ITaskProps {
  task: IBlock;
  orgUsers: IUser[];

  demo?: boolean;
  statusList?: IBlockStatus[];
  onEdit?: (task: IBlock) => void;
  onDelete?: (task: IBlock) => void; // TODO: we don't use it
}

// TODO: how do we show thelabels?

const Task: React.FC<ITaskProps> = (props) => {
  const { task, onEdit, demo, statusList, orgUsers } = props;

  const onDeleteTask = () => {
    if (demo) {
      return;
    }

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
    <Dropdown
      overlay={menu}
      trigger={["click"]}
      placement="bottomRight"
      className="task-menu-dropdown"
    >
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

  const onClick = (evt: React.MouseEvent<HTMLDivElement>) => {
    const target = evt.target as HTMLElement;
    const shouldIgnore =
      ignoreClassNames.findIndex((className) => {
        if (target.classList.contains(className)) {
          return true;
        }

        return false;
      }) !== -1;

    if (shouldIgnore) {
      return;
    }

    if (onEdit) {
      onEdit(task);
    }
  };

  const stopPropagation = (evt: React.MouseEvent<HTMLDivElement>) => {
    evt.stopPropagation();
  };

  return (
    <StyledContainer s={{ minWidth: "280px", width: "100%" }}>
      <Space direction="vertical" style={{ width: "100%" }}>
        <StyledContainer>
          <StyledContainer s={{ flex: 1 }}>
            <span style={{ color: priorityToColorMap[task.priority!] }}>
              {task.priority}
            </span>
          </StyledContainer>
          <StyledContainer
            onClick={(evt) => {
              evt.stopPropagation();
            }}
          >
            {options}
          </StyledContainer>
        </StyledContainer>
        <StyledContainer onClick={onClick} s={{ cursor: "pointer" }}>
          <Typography.Paragraph
            ellipsis={{
              rows: 2,
              expandable: true,
            }}
            style={{ marginBottom: "0" }}
          >
            {task.description}
          </Typography.Paragraph>
        </StyledContainer>
        <StyledContainer>
          <StyledContainer onClick={stopPropagation}>
            <TaskStatusContainer
              task={task}
              className="task-status"
              demo={demo}
              statusList={statusList}
            />
          </StyledContainer>
        </StyledContainer>
        {task.assignees && task.assignees.length > 0 && (
          <TaskThumbnailAssignees task={task} users={orgUsers} />
        )}
        {task.dueAt && <TaskThumbnailDueDate task={task} />}
        {task.subTasks && task.subTasks.length > 0 && (
          <TaskThumbnailSubTasks task={task} />
        )}
      </Space>
    </StyledContainer>
  );
};

export default React.memo(Task);
