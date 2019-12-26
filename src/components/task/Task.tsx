import styled from "@emotion/styled";
import { Button } from "antd";
import React from "react";
import { useDispatch, useStore } from "react-redux";
import { IBlock } from "../../models/block/block";
import deleteBlockOperationFunc from "../../redux/operations/block/deleteBlock";
import DeleteButtonWithPrompt from "../DeleteButtonWithPrompt";
import StyledButton from "../styled/Button";
import StyledFlexContainer from "../styled/FlexContainer";
import Text from "../Text";
import Priority from "./Priority";
import ToggleSwitchContainer from "./ToggleSwitch";

export interface ITaskProps {
  task: IBlock;
  onEdit?: (task: IBlock) => void;
}

const Task: React.FC<ITaskProps> = props => {
  const { task, onEdit } = props;

  const onDeleteTask = () => {
    deleteBlockOperationFunc({ block: task });
  };

  return (
    <StyledTask>
      <StyledFlexContainer>
        <div>
          <ToggleSwitchContainer task={task} />
        </div>
        <StyledPriorityContainer>
          <Priority level={task.priority!} />
        </StyledPriorityContainer>
      </StyledFlexContainer>
      <StyledDescriptionContainer>
        <Text text={task.description!} rows={3} />
      </StyledDescriptionContainer>
      <StyledControlsContainer>
        {onEdit && (
          <StyledButton
            icon="edit"
            onClick={() => onEdit(task)}
            title="edit task"
            style={{ marginRight: "8px" }}
          />
        )}
        <DeleteButtonWithPrompt
          onDelete={onDeleteTask}
          title="Are you sure you want to delete this task?"
        >
          <Button icon="delete" type="danger" className="sk-minitask-close" />
        </DeleteButtonWithPrompt>
      </StyledControlsContainer>
    </StyledTask>
  );
};

export default Task;

const StyledTask = styled.div({
  padding: "8px",
  border: "1px solid #ccc",
  borderRadius: "4px",
  backgroundColor: "white",
  display: "flex",
  flexDirection: "column"
});

const StyledDescriptionContainer = styled.div({
  margin: "16px 0"
});

const StyledPriorityContainer = styled.div({
  marginLeft: "8px"
});

const StyledControlsContainer = styled.div({
  textAlign: "right"
});
