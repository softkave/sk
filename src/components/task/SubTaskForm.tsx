/*eslint no-useless-computed-key: "off"*/

import { EditOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, Space } from "antd";
import { FormikErrors } from "formik";
import React from "react";
import { Check, Trash2, X as CloseIcon } from "react-feather";
import { blockConstants } from "../../models/block/constants";
import { ISubTaskInput } from "../../models/task/types";
import FormError from "../forms/FormError";
import StyledContainer from "../styled/Container";

export type ISubTaskErrors = FormikErrors<ISubTaskInput>;

export interface ISubTaskFormProps {
  subTask: ISubTaskInput;
  onChange: (subTask: ISubTaskInput) => void;
  onDelete: () => void;
  onToggle: () => void;
  onEdit: () => void;
  onSave: () => void;
  isNew?: boolean;
  disabled?: boolean;
  isEditing?: boolean;
  errorMessage?: string | null;
  onCancelEdit?: () => void;
}

const SubTaskForm: React.FC<ISubTaskFormProps> = (props) => {
  const {
    subTask,
    onChange,
    onDelete,
    onCancelEdit,
    errorMessage,
    onToggle,
    onEdit,
    isEditing,
    onSave,
    disabled,
    isNew,
  } = props;

  const renderInputs = () => {
    return (
      <StyledContainer s={{ flexDirection: "column", width: "100%" }}>
        <Form.Item
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          help={errorMessage && <FormError error={errorMessage} />}
          style={{ marginBottom: 8 }}
        >
          <Input.TextArea
            disabled={disabled}
            autoSize={{ minRows: 2, maxRows: 6 }}
            autoComplete="off"
            onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
              const val = event.target.value;
              onChange({ ...subTask, description: val });
            }}
            value={subTask.description}
            placeholder="Enter sub-task description"
            maxLength={blockConstants.maxDescriptionLength}
          />
        </Form.Item>
      </StyledContainer>
    );
  };

  const renderRegularLabel = () => {
    return (
      <StyledContainer s={{ marginBottom: "8px" }}>
        {subTask.description}
      </StyledContainer>
    );
  };

  const renderLabelButtons = () => {
    return (
      <Space>
        {isEditing && (
          <Button
            icon={<Check />}
            onClick={onSave}
            htmlType="button"
            disabled={disabled || subTask.description.length === 0}
            className="icon-btn"
          />
        )}
        {isEditing && (
          <Button
            onClick={onCancelEdit}
            icon={<CloseIcon />}
            disabled={
              disabled ||
              isNew ||
              !onCancelEdit ||
              subTask.description.length === 0
            }
            htmlType="button"
            className="icon-btn"
          />
        )}
        {!isEditing && (
          <Button
            disabled={disabled}
            icon={<EditOutlined />}
            onClick={onEdit}
            htmlType="button"
            className="icon-btn"
          />
        )}
        <Button
          disabled={disabled}
          icon={<Trash2 />}
          onClick={onDelete}
          htmlType="button"
          className="icon-btn"
        />
      </Space>
    );
  };

  const renderLabel = () => {
    return (
      <StyledContainer>
        <Checkbox
          checked={!!subTask.completedBy}
          onChange={onToggle}
          disabled={disabled}
        />
        <StyledContainer
          s={{
            width: "100%",
            flexDirection: "column",
            marginLeft: "16px",
            flex: 1,
          }}
        >
          {isEditing ? renderInputs() : renderRegularLabel()}
          <StyledContainer>{renderLabelButtons()}</StyledContainer>
        </StyledContainer>
      </StyledContainer>
    );
  };

  return renderLabel();
};

export default SubTaskForm;
