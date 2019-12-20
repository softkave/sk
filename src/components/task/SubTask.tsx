import styled from "@emotion/styled";
import { Button, Typography } from "antd";
import React from "react";
import StyledContainer from "../styled/Container";

export interface ISubTaskValues {
  customId: string;
  description: string;
}

export interface ISubTaskProps {
  subTask: ISubTaskValues;
  onEdit: () => void;
  onDelete: () => void;
}

const SubTask: React.SFC<ISubTaskProps> = props => {
  const { subTask, onEdit, onDelete } = props;

  const renderControls = () => {
    return (
      <React.Fragment>
        <StyledContainer s={{ flex: 1, marginRight: "8px" }}>
          <Button block type="danger" onClick={onDelete}>
            Delete
          </Button>
        </StyledContainer>
        <StyledContainer s={{ flex: 1, marginRight: "8px" }}>
          <Button block onClick={onEdit}>
            Edit
          </Button>
        </StyledContainer>
        {/* <StyledButton type="danger" icon="delete" onClick={onDelete} />
        <StyledButton icon="edit" onClick={onEdit} /> */}
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
  display: "flex"
});
