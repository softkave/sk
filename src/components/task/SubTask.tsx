import styled from "@emotion/styled";
import { Icon, Input, Switch } from "antd";
import { FormikErrors } from "formik";
import React from "react";
import { ISubTask } from "../../models/block/block";
import FormError from "../form/FormError";
import StyledContainer from "../styled/Container";
import StyledFlatButton from "../styled/FlatButton";

export type ISubTaskErrors = FormikErrors<ISubTask>;

export interface ISubTaskProps {
  subTask: ISubTask;
  onChange: (subTask: ISubTask) => void;
  onDelete: () => void;
  onToggle: () => void;
  onEdit: () => void;
  onSave: () => void;
  isEditing?: boolean;
  onCancelEdit?: () => void;
  errorMessage?: string | null;
}

const SubTask: React.SFC<ISubTaskProps> = props => {
  const {
    subTask,
    onChange,
    onDelete,
    onCancelEdit,
    errorMessage,
    onToggle,
    onEdit,
    isEditing,
    onSave
  } = props;

  const renderDeleteBtn = () => (
    <StyledFlatButton onClick={onDelete} style={{ color: "rgb(255, 77, 79)" }}>
      <Icon type="delete" theme="filled" /> Delete
    </StyledFlatButton>
  );

  const renderMainControls = () => {
    return (
      <StyledContainer s={{ flex: 1, marginTop: "8px" }}>
        {renderDeleteBtn()}
        <StyledFlatButton
          onClick={onEdit}
          style={{ marginLeft: "48px", color: "#1890ff" }}
        >
          <Icon type="edit" theme="twoTone" /> Edit
        </StyledFlatButton>
      </StyledContainer>
    );
  };

  const renderDescriptionText = () => {
    return (
      <StyledContainer
        s={{
          lineHeight: "24px"
        }}
      >
        {subTask.description}
      </StyledContainer>
    );
  };

  const renderEditControls = () => {
    return (
      <StyledContainer s={{ marginTop: "6px" }}>
        {renderDeleteBtn()}
        {onCancelEdit && (
          <StyledFlatButton
            onClick={onCancelEdit}
            style={{ marginLeft: "48px", color: "rgb(255, 77, 79)" }}
          >
            <Icon
              type="close-circle"
              theme="twoTone"
              twoToneColor="rgb(255, 77, 79)"
            />{" "}
            Cancel
          </StyledFlatButton>
        )}
        {subTask.description.length > 0 && (
          <StyledFlatButton
            onClick={onSave}
            style={{ marginLeft: "48px", color: "#1890ff" }}
          >
            <Icon type="save" theme="twoTone" /> Save
          </StyledFlatButton>
        )}
      </StyledContainer>
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
              ...subTask,
              description: event.target.value
            })
          }
          value={subTask.description}
          style={{ marginBottom: 0 }}
        />
        {errorMessage && <FormError error={errorMessage} />}
      </React.Fragment>
    );
  };

  return (
    <StyledSubTaskContainer>
      <StyledContainer s={{ marginBottom: "12px" }}>
        <Switch checked={!!subTask.completedAt} onChange={onToggle} />
      </StyledContainer>
      <StyledDescriptionContainer>
        {isEditing ? renderDescriptionInput() : renderDescriptionText()}
      </StyledDescriptionContainer>
      {isEditing ? renderEditControls() : renderMainControls()}
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
  flex: "1",
  flexDirection: "column"
});
