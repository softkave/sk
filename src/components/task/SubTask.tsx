import styled from "@emotion/styled";
import { Button, Typography } from "antd";
import React from "react";

export interface ISubTaskValues {
  description: string;
}

export interface ISubTaskProps {
  subTask: ISubTaskValues;
  onEdit: () => void;
  onDelete: () => void;
}

const SubTask: React.FC<ISubTaskProps> = props => {
  const { subTask, onEdit, onDelete } = props;

  const renderControls = () => {
    return (
      <React.Fragment>
        <StyledButton type="danger" icon="delete" onClick={onDelete} />
        <StyledButton icon="edit" onClick={onEdit} />
      </React.Fragment>
    );
  };

  const renderDescriptionText = () => {
    return <Typography.Text ellipsis>{subTask.description}</Typography.Text>;
  };

  return (
    <StyledSubTaskContainer>
      <StyledDescriptionContainer>
        {renderDescriptionText()}
      </StyledDescriptionContainer>
      <StyledControlsContainer>{renderControls()}</StyledControlsContainer>
    </StyledSubTaskContainer>
  );
};

export default SubTask;

const StyledSubTaskContainer = styled.div({
  display: "flex",
  flexDirection: "column"
});

const StyledDescriptionContainer = styled.div({
  display: "flex",
  flex: "1"
});

const StyledControlsContainer = styled.div({
  display: "flex",
  flexDirection: "row-reverse"
});

const StyledButton = styled(Button)({
  marginLeft: "8px"
});
