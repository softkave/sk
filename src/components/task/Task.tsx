import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import styled from "@emotion/styled";
import React from "react";
import { IBlock } from "../../models/block/block";
import deleteBlockOperationFunc from "../../redux/operations/block/deleteBlock";
import DeleteButtonWithPrompt from "../DeleteButtonWithPrompt";
import StyledContainer from "../styled/Container";
import StyledFlatButton from "../styled/FlatButton";
import StyledFlexContainer from "../styled/FlexContainer";
import Text from "../Text";
import Priority from "./Priority";
import ToggleSwitchContainer from "./ToggleSwitch";

export interface ITaskProps {
  task: IBlock;
  onEdit?: (task: IBlock) => void;
}

const Task: React.FC<ITaskProps> = (props) => {
  const { task, onEdit } = props;

  const onDeleteTask = () => {
    deleteBlockOperationFunc({ block: task });
  };

  return (
    <StyledTask>
      <StyledFlexContainer>
        <StyledContainer s={{ flex: 1 }}>
          <ToggleSwitchContainer task={task} />
        </StyledContainer>
        <StyledContainer s={{ marginLeft: "8px" }}>
          <Priority level={task.priority!} />
        </StyledContainer>
      </StyledFlexContainer>
      <StyledDescriptionContainer>
        <Text text={task.description!} rows={3} />
      </StyledDescriptionContainer>
      <StyledControlsContainer>
        {onEdit && (
          <StyledFlatButton
            onClick={() => onEdit(task)}
            title="edit task"
            style={{ marginRight: "32px" }}
          >
            <EditOutlined />
          </StyledFlatButton>
        )}
        <DeleteButtonWithPrompt
          onDelete={onDeleteTask}
          title="Are you sure you want to delete this task?"
        >
          <StyledFlatButton>
            <DeleteOutlined />
          </StyledFlatButton>
        </DeleteButtonWithPrompt>
      </StyledControlsContainer>
    </StyledTask>
  );
};

const StyledTask = styled.div({
  display: "flex",
  flexDirection: "column",
  minWidth: "280px",
});

const StyledDescriptionContainer = styled.div({
  margin: "16px 0",
});

const StyledControlsContainer = styled.div({
  textAlign: "right",
});

export default React.memo(Task);
