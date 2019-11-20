import styled from "@emotion/styled";
import { Button, Input, Typography } from "antd";
import React from "react";
import * as yup from "yup";
import { blockConstants } from "../../models/block/constants";
import { textPattern } from "../../models/user/descriptor";
import FormError from "../form/FormError";
import StyledFlatButton from "../styled/FlatButton";

const descriptionValidationSchema = yup
  .string()
  .max(blockConstants.maxDescriptionLength)
  .matches(textPattern)
  .required();

export interface ISubTaskValues {
  description: string;
}

export interface ISubTaskProps {
  subTask: ISubTaskValues;
  onChange: (subTask: ISubTaskValues) => void;
  onDelete: () => void;
}

const SubTask: React.SFC<ISubTaskProps> = props => {
  const { subTask, onChange, onDelete } = props;
  const [isEditing, setEditing] = React.useState(false);
  const [description, setDescription] = React.useState(subTask.description);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const submitUpdate = () => {
    onChange({ description });
  };

  const resetDescription = () => {
    setDescription(subTask.description);
  };

  const cancelEditing = () => {
    resetDescription();
    setErrorMessage(null);
    setEditing(false);
  };

  const startEditing = () => {
    setEditing(true);
  };

  const onDescriptionChange = (value: string) => {
    const error = descriptionValidationSchema.validateSync(value);

    if (error) {
      setErrorMessage(error);
    }

    setDescription(value);
  };

  const renderEditingControls = () => {
    return (
      <React.Fragment>
        <StyledUpdateTaskButton icon="check" onClick={submitUpdate} />
        <StyledCancelEditingButton
          icon="close-circle"
          onClick={cancelEditing}
        />
      </React.Fragment>
    );
  };

  const renderControls = () => {
    return (
      <React.Fragment>
        {isEditing && renderEditingControls()}
        {!isEditing && <StyledFlatButton icon="edit" onClick={startEditing} />}
        <StyledFlatButton icon="delete" onClick={onDelete} />
      </React.Fragment>
    );
  };

  const renderDescriptionText = () => {
    return <Typography.Text ellipsis>{subTask.description}</Typography.Text>;
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
          onChange={event => onDescriptionChange(event.target.value)}
          value={description}
        />
        {errorMessage && <FormError error={errorMessage} />}
      </React.Fragment>
    );
  };

  const renderDescription = () => {
    return isEditing ? renderDescriptionInput() : renderDescriptionText();
  };

  return (
    <StyledSubTaskContainer>
      <StyledDescriptionContainer>
        {renderDescription()}
      </StyledDescriptionContainer>
      <StyledControlsContainer>{renderControls()}</StyledControlsContainer>
    </StyledSubTaskContainer>
  );
};

export default SubTask;

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
