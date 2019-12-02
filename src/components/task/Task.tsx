import styled from "@emotion/styled";
import { Button } from "antd";
import React from "react";
import { IBlock } from "../../models/block/block";
import deleteBlockOperationFunc from "../../redux/operations/block/deleteBlock";
import DeleteButton from "../DeleteButton";
import StyledFlexContainer from "../styled/FlexContainer";
import Priority from "./Priority";
import ToggleSwitch from "./ToggleSwitch";

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
          <ToggleSwitch task={task} />
        </div>
        <StyledPriorityContainer>
          <Priority level={task.priority} />
        </StyledPriorityContainer>
      </StyledFlexContainer>
      <StyledDescriptionContainer>
        <StyledTaskDescription>{task.description}</StyledTaskDescription>
      </StyledDescriptionContainer>
      <StyledControlsContainer>
        {onEdit && (
          <Button icon="edit" onClick={() => onEdit(task)} title="edit task" />
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
      </StyledControlsContainer>
    </StyledTask>
  );
};

export default Task;

const StyledTaskDescription = styled.p({
  padding: 0,
  margin: 0,
  whiteSpace: "pre-wrap",
  wordBreak: "normal",
  overflowWrap: "break-word",
  hyphens: "auto"
});

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
  display: "flex",
  flex: 1,
  marginLeft: "8px"
});

const StyledControlsContainer = styled.div({
  textAlign: "right"
});

const StyledTaskSwitchContainer = styled.div({});
