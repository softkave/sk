import { EditOutlined } from "@ant-design/icons";
import { Button, Form, Input, Space } from "antd";
import { FormikErrors, FormikTouched } from "formik";
import React from "react";
import { DraggableProvided, DraggableStateSnapshot } from "react-beautiful-dnd";
import { Check, Trash, X } from "react-feather";
import { IBlockStatus } from "../../models/block/block";
import { blockConstants } from "../../models/block/constants";
import FormError from "../form/FormError";
import StyledContainer from "../styled/Container";

export interface IStatusFormItemProps {
  value: IBlockStatus;
  provided: DraggableProvided;
  snapshot: DraggableStateSnapshot;
  onEdit: () => void;
  onDelete: () => void;
  onChange: (data: Partial<IBlockStatus>) => void;
  onDiscardChanges: () => void;
  onCommitChanges: () => void;

  isNew?: boolean;
  isEditing?: boolean;
  disabled?: boolean;
  touched?: FormikTouched<IBlockStatus>;
  errors?: FormikErrors<IBlockStatus>;
  style?: React.CSSProperties;
  handleBlur?: (
    field: keyof IBlockStatus,
    event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

const StatusFormItem: React.FC<IStatusFormItemProps> = (props) => {
  const {
    touched,
    errors,
    value,
    handleBlur,
    onCommitChanges,
    onDiscardChanges,
    onChange,
    disabled,
    provided,
    onDelete,
    snapshot,
    isEditing,
    isNew,
    onEdit,
    style,
  } = props;

  const renderEditingStatus = () => {
    return (
      <StyledContainer s={{ flexDirection: "column", width: "100%" }}>
        <Form.Item
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          help={
            touched?.name && errors?.name && <FormError error={errors?.name} />
          }
          style={{ marginBottom: 8 }}
        >
          <Input
            autoComplete="off"
            onBlur={(evt) => handleBlur && handleBlur("name", evt)}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              const val = event.target.value;
              onChange({ name: val });
            }}
            value={value.name}
            placeholder="Enter status name"
            disabled={disabled}
            maxLength={blockConstants.maxLabelNameLength}
          />
        </Form.Item>
        <Form.Item
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          help={
            touched?.description &&
            errors?.description && <FormError error={errors.description} />
          }
          style={{ marginBottom: 8 }}
        >
          <Input.TextArea
            autoSize={{ minRows: 2, maxRows: 6 }}
            autoComplete="off"
            onBlur={(evt) => handleBlur && handleBlur("description", evt)}
            onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) => {
              const val = event.target.value;
              onChange({ description: val });
            }}
            value={value.description}
            placeholder="Enter status description"
            maxLength={blockConstants.maxLabelDescriptionLength}
          />
        </Form.Item>
      </StyledContainer>
    );
  };

  const renderRegularStatus = () => {
    return (
      <StyledContainer
        s={{ flexDirection: "column", width: "100%", marginBottom: "8px" }}
      >
        <StyledContainer
          style={{
            color: "rgba(0,0,0,0.85)",
          }}
        >
          {value.name}
        </StyledContainer>
        <StyledContainer s={{ marginTop: "4px" }}>
          {value.description}
        </StyledContainer>
      </StyledContainer>
    );
  };

  const renderStatusButtons = () => {
    return (
      <Space>
        {isEditing && (
          <Button
            icon={<Check style={{ width: "18px" }} />}
            onClick={onCommitChanges}
            htmlType="button"
            disabled={disabled}
          />
        )}
        {isEditing && (
          <Button
            onClick={onDiscardChanges}
            icon={<X style={{ width: "18px" }} />}
            disabled={isNew}
            htmlType="button"
          />
        )}
        {!isEditing && (
          <Button
            disabled={disabled}
            // icon={<Edit3 style={{ width: "16px" }} />}
            icon={<EditOutlined style={{ fontSize: "14px" }} />}
            onClick={onEdit}
            htmlType="button"
          />
        )}
        <Button
          disabled={disabled}
          icon={<Trash style={{ width: "14px" }} />}
          onClick={() => onDelete()}
          htmlType="button"
        />
      </Space>
    );
  };

  const renderStatus = () => {
    return (
      <StyledContainer
        s={{
          width: "100%",
          padding: "24px",
          flexDirection: "column",
          ...(style || {}),
        }}
        ref={provided.innerRef}
        {...provided.draggableProps}
        {...provided.dragHandleProps}
        style={{
          backgroundColor: snapshot.isDragging ? "#eee" : undefined,
          cursor: snapshot.isDragging ? "grabbing" : undefined,
          ...provided.draggableProps.style,
        }}
      >
        <StyledContainer s={{ flexDirection: "column" }}>
          {isEditing ? renderEditingStatus() : renderRegularStatus()}
        </StyledContainer>
        <StyledContainer>{renderStatusButtons()}</StyledContainer>
      </StyledContainer>
    );
  };

  return renderStatus();
};

export default React.memo(StatusFormItem);
