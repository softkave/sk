import styled from "@emotion/styled";
import { Button, Input } from "antd";
import React from "react";
import FormError from "../form/FormError";
import { ISubTaskValues } from "./SubTask";

export interface ISubTaskFormProps {
  subTask: ISubTaskValues;
  onChange: (subTask: ISubTaskValues) => void;
  onDelete: () => void;
  onCommitUpdates: () => void;
  onCancelEdit: () => void;
  errorMessage?: string | null;
}

const SubTaskForm: React.FC<ISubTaskFormProps> = props => {
  const {
    subTask,
    onChange,
    onDelete,
    onCommitUpdates,
    onCancelEdit,
    errorMessage
  } = props;

  const renderEditingControls = () => {
    return (
      <React.Fragment>
        <StyledCancelEditingButton icon="close" onClick={onCancelEdit} />
        <StyledUpdateTaskButton icon="check" onClick={onCommitUpdates} />
      </React.Fragment>
    );
  };

  const renderControls = () => {
    return (
      <React.Fragment>
        <StyledButton type="danger" icon="delete" onClick={onDelete} />
        {renderEditingControls()}
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
          onChange={event => onChange({ description: event.target.value })}
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
  flexDirection: "row-reverse"
});

// TODO: All of these color and constants should be kept in a theme file
// TODO: Replace these colors with attractive versions (hsla)
const StyledUpdateTaskButton = styled(Button)({
  border: "none",
  backgroundColor: "green !important",
  color: "white !important",
  marginLeft: "8px"
});

const StyledCancelEditingButton = styled(Button)({
  color: "red !important",
  marginLeft: "8px"
});

const StyledButton = styled(Button)({
  marginLeft: "8px"
});
