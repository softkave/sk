import styled from "@emotion/styled";
import { Icon } from "antd";
import React from "react";
import { IBlock } from "../../models/block/block";
import deleteBlockOperationFunc from "../../redux/operations/block/deleteBlock";
import DeleteButtonWithPrompt from "../DeleteButtonWithPrompt";
import StyledFlatButton from "../styled/FlatButton";
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
          <StyledFlatButton
            onClick={() => onEdit(task)}
            title="edit task"
            style={{ marginRight: "32px" }}
          >
            <Icon type="edit" />
          </StyledFlatButton>
        )}
        <DeleteButtonWithPrompt
          onDelete={onDeleteTask}
          title="Are you sure you want to delete this task?"
        >
          <StyledFlatButton>
            <Icon type="delete" />
          </StyledFlatButton>
        </DeleteButtonWithPrompt>
      </StyledControlsContainer>
    </StyledTask>
  );
};

export default Task;

const StyledTask = styled.div({
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
