import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import styled from "@emotion/styled";
import { Space } from "antd";
import React from "react";
import { IBlock } from "../../models/block/block";
import deleteBlockOperationFunc from "../../redux/operations/block/deleteBlock";
import DeleteButtonWithPrompt from "../DeleteButtonWithPrompt";
import StyledContainer from "../styled/Container";
import StyledFlatButton from "../styled/FlatButton";
import Text from "../Text";
import Priority, { priorityToColorMap } from "./Priority";
import TaskStatusContainer from "./TaskStatusContainer";
import ToggleSwitchContainer from "./ToggleSwitch";

export interface ITaskProps {
  task: IBlock;
  onEdit?: (task: IBlock) => void;
}

// TODO: how do we show thelabels?

const Task: React.FC<ITaskProps> = (props) => {
  const { task, onEdit } = props;

  const onDeleteTask = () => {
    deleteBlockOperationFunc({ block: task });
  };

  return (
    <StyledTask direction="vertical">
      <StyledContainer>
        {/* <StyledContainer s={{ flex: 1 }}>
          <ToggleSwitchContainer task={task} />
        </StyledContainer> */}
        <StyledContainer>
          <span style={{ color: priorityToColorMap[task.priority!] }}>
            {task.priority}
          </span>
          {/* <Priority level={task.priority!} /> */}
        </StyledContainer>
      </StyledContainer>
      <Text text={task.description!} rows={3} />
      <StyledControlsContainer>
        <StyledContainer s={{ flex: 1 }}>
          <TaskStatusContainer task={task} />
        </StyledContainer>
        <Space size="large">
          {onEdit && (
            <StyledFlatButton onClick={() => onEdit(task)}>
              <EditOutlined />
            </StyledFlatButton>
          )}
          <DeleteButtonWithPrompt onDelete={onDeleteTask}>
            <StyledFlatButton>
              <DeleteOutlined />
            </StyledFlatButton>
          </DeleteButtonWithPrompt>
        </Space>
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
