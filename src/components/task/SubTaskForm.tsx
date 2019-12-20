import styled from "@emotion/styled";
import { Button, Input } from "antd";
import React from "react";
import FormError from "../form/FormError";
import StyledContainer from "../styled/Container";
import { ISubTaskValues } from "./SubTask";

export interface ISubTaskFormProps {
  subTask: ISubTaskValues;
  onChange: (subTask: ISubTaskValues) => void;
  onDelete: () => void;
  onCommitUpdates: () => void;
  onCancelEdit: () => void;
  errorMessage?: string | null;
}

const SubTaskForm: React.SFC<ISubTaskFormProps> = props => {
  const {
    subTask,
    onChange,
    onDelete,
    onCommitUpdates,
    onCancelEdit,
    errorMessage
  } = props;

  const renderControls = () => {
    return (
      <React.Fragment>
        <StyledContainer s={{ flex: 1, marginRight: "8px" }}>
          <Button block type="danger" onClick={onDelete}>
            Delete
          </Button>
        </StyledContainer>
        <StyledContainer s={{ flex: 1, marginRight: "8px" }}>
          <Button block onClick={onCancelEdit}>
            Cancel
          </Button>
        </StyledContainer>
        <StyledContainer s={{ flex: 1 }}>
          <Button block type="primary" onClick={onCommitUpdates}>
            Save
          </Button>
        </StyledContainer>
      </React.Fragment>
    );
  };

  const renderDescriptionInput = () => {
    return (
      <React.Fragment>
        <Input.TextArea
          // TODO: These constants should go in a theme file
          autosize={{ minRows: 2, maxRows: 6 }}
          autoComplete="off"
          name="description"
          placeholder="Description"
          onChange={event =>
            onChange({
              customId: subTask.customId,
              description: event.target.value
            })
          }
          value={subTask.description}
        />
        {errorMessage && <FormError error={errorMessage} />}
      </React.Fragment>
    );
  };

  return (
    <StyledSubTaskContainer>
      <StyledDescriptionContainer>
        {renderDescriptionInput()}
      </StyledDescriptionContainer>
      <StyledControlsContainer>{renderControls()}</StyledControlsContainer>
    </StyledSubTaskContainer>
  );
};

export default SubTaskForm;

const StyledSubTaskContainer = styled.div({
  display: "flex",
  flexDirection: "column"
});

const StyledDescriptionContainer = styled.div({
  display: "flex",
  flex: "1",
  flexDirection: "column"
});

const StyledControlsContainer = styled.div({
  display: "flex",
  marginTop: "8px"
});
