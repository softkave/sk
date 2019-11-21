import styled from "@emotion/styled";
import { Button, Input } from "antd";
import React from "react";
import FormError from "../form/FormError";
import StyledFlatButton from "../styled/FlatButton";
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

  const renderEditingControls = () => {
    return (
      <React.Fragment>
        <StyledUpdateTaskButton icon="check" onClick={onCommitUpdates} />
        <StyledCancelEditingButton icon="close-circle" onClick={onCancelEdit} />
      </React.Fragment>
    );
  };

  const renderControls = () => {
    return (
      <React.Fragment>
        {renderEditingControls()}
        <StyledFlatButton icon="delete" onClick={onDelete} />
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
  display: "flex"
});

const StyledDescriptionContainer = styled.div({
  display: "flex",
  flex: "1"
});

const StyledControlsContainer = styled.div({
  marginLeft: "16px"
});

// TODO: All of these color and constants should be kept in a theme file
// TODO: Replace these colors with attractive versions (hsla)
const StyledUpdateTaskButton = styled(Button)({
  border: "none",
  backgroundColor: "green !important",
  color: "white !important"
});

const StyledCancelEditingButton = styled(Button)({
  color: "red !important"
});
