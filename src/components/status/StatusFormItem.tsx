import {
  CaretDownOutlined,
  CaretUpOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { Button, Form, Input, Space, Typography } from "antd";
import { FormikErrors, FormikTouched } from "formik";
import React from "react";
import { DraggableProvided, DraggableStateSnapshot } from "react-beautiful-dnd";
import { Check, Trash2, X as CloseIcon } from "react-feather";
import { IBlockStatusInput } from "../../models/block/block";
import { blockConstants } from "../../models/block/constants";
import ColorPicker from "../forms/ColorPicker";
import FormError from "../forms/FormError";

export interface IStatusFormItemProps {
  value: IBlockStatusInput;
  canMoveUp: boolean;
  canMoveDown: boolean;
  provided: DraggableProvided;
  snapshot: DraggableStateSnapshot;
  onEdit: () => void;
  onDelete: () => void;
  onChange: (data: Partial<IBlockStatusInput>) => void;
  onDiscardChanges: () => void;
  onCommitChanges: () => void;
  onChangePosition: (up: boolean) => void;

  isNew?: boolean;
  isEditing?: boolean;
  disabled?: boolean;
  touched?: FormikTouched<IBlockStatusInput>;
  errors?: FormikErrors<IBlockStatusInput>;
  style?: React.CSSProperties;
  handleBlur?: (
    field: keyof IBlockStatusInput,
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
    onChangePosition,
    canMoveUp,
    canMoveDown,
  } = props;

  const renderEditingStatus = () => {
    return (
      <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
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
      </div>
    );
  };

  const renderRegularStatus = () => {
    return (
      <div
        style={{
          flexDirection: "column",
          width: "100%",
          marginBottom: "8px",
        }}
      >
        <div
          style={{
            color: "rgba(0,0,0,0.85)",
          }}
        >
          <Typography.Text
            style={{
              textTransform: "capitalize",
              borderBottom: `2px solid ${value.color}`,
            }}
          >
            {value.name}
          </Typography.Text>
        </div>
        <Typography.Paragraph
          type="secondary"
          style={{ margin: 0, marginTop: "8px" }}
        >
          {value.description}
        </Typography.Paragraph>
      </div>
    );
  };

  const renderStatusButtons = () => {
    return (
      <Space style={{ padding: "0px 16px" }}>
        {isEditing && (
          <Button
            icon={<Check />}
            onClick={onCommitChanges}
            htmlType="button"
            disabled={disabled || value.name.length === 0}
            className="icon-btn"
          />
        )}
        {isEditing && (
          <Button
            onClick={onDiscardChanges}
            icon={<CloseIcon />}
            disabled={isNew || value.name.length === 0}
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
        {canMoveUp && (
          <Button
            disabled={disabled}
            icon={<CaretUpOutlined />}
            onClick={() => onChangePosition(true)}
            htmlType="button"
            className="icon-btn"
          />
        )}
        {canMoveDown && (
          <Button
            disabled={disabled}
            icon={<CaretDownOutlined />}
            onClick={() => onChangePosition(false)}
            htmlType="button"
            className="icon-btn"
          />
        )}
        <Button
          disabled={disabled}
          icon={<Trash2 />}
          onClick={() => onDelete()}
          htmlType="button"
          className="icon-btn"
        />
      </Space>
    );
  };

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        padding: "0px 16px",
        flexDirection: "column",
        backgroundColor: snapshot.isDragging ? "#eee" : undefined,
        cursor: snapshot.isDragging ? "grabbing" : undefined,
        ...provided.draggableProps.style,
        ...(style || {}),
      }}
      ref={provided.innerRef ? provided.innerRef : undefined}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          padding: "8px 16px",
          paddingTop: "0px",
        }}
      >
        <div
          style={{
            flexDirection: "column",
            flex: 1,
            marginRight: "8px",
          }}
        >
          {isEditing ? renderEditingStatus() : renderRegularStatus()}
        </div>
        <div>
          <ColorPicker
            value={value.color}
            disabled={disabled ? true : !isEditing}
            onChange={(val) => {
              onChange({ color: val });
            }}
          />
        </div>
      </div>
      {renderStatusButtons()}
    </div>
  );
};

export default React.memo(StatusFormItem);
