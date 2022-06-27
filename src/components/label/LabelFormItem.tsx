import { EditOutlined } from "@ant-design/icons";
import { Button, Form, Input, Space, Tag, Typography } from "antd";
import { FormikErrors, FormikTouched } from "formik";
import React from "react";
import { Check, Trash2, X as CloseIcon } from "react-feather";
import { IBlockLabelInput } from "../../models/block/block";
import { blockConstants } from "../../models/block/constants";
import ColorPicker from "../forms/ColorPicker";
import FormError from "../forms/FormError";

export interface ILabelFormItemProps {
  value: IBlockLabelInput;
  onEdit: () => void;
  onDelete: () => void;
  onChange: (data: Partial<IBlockLabelInput>) => void;
  onDiscardChanges: () => void;
  onCommitChanges: () => void;

  isNew?: boolean;
  isEditing?: boolean;
  disabled?: boolean;
  touched?: FormikTouched<IBlockLabelInput>;
  errors?: FormikErrors<IBlockLabelInput>;
  style?: React.CSSProperties;
  handleBlur?: (
    field: keyof IBlockLabelInput,
    event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

// TODO: preview the colors on change so that the user can see what it'll look like
// TODO: add a get random color button that uses randomColor to get a new random color

const LabelFormItem: React.FC<ILabelFormItemProps> = (props) => {
  const {
    touched,
    errors,
    value,
    handleBlur,
    onCommitChanges,
    onDiscardChanges,
    onChange,
    disabled,
    onDelete,
    isEditing,
    isNew,
    onEdit,
    style,
  } = props;

  const renderInputs = () => {
    return (
      <div style={{ flexDirection: "column", width: "100%" }}>
        {value.name && (
          <Form.Item style={{ marginBottom: 8 }}>
            <Tag color={value.color}>{value.name}</Tag>
          </Form.Item>
        )}
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
            placeholder="Enter label name"
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
            placeholder="Enter label description"
            maxLength={blockConstants.maxLabelNameLength}
          />
        </Form.Item>
      </div>
    );
  };

  const renderRegularLabel = () => {
    return (
      <div
        style={{
          flexDirection: "column",
          width: "100%",
          marginBottom: "8px",
        }}
      >
        <Tag
          style={{
            color: value.color,
            textTransform: "capitalize",
          }}
        >
          {value.name}
        </Tag>
        <Typography.Paragraph
          type="secondary"
          style={{ margin: 0, marginTop: "8px" }}
        >
          {value.description}
        </Typography.Paragraph>
      </div>
    );
  };

  const renderLabelButtons = () => {
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

  const renderLabel = () => {
    return (
      <div
        style={{
          display: "flex",
          width: "100%",
          flexDirection: "column",
          ...(style || {}),
        }}
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
            {isEditing ? renderInputs() : renderRegularLabel()}
          </div>
          <div style={{ flexDirection: "column", height: "100%" }}>
            <ColorPicker
              value={value.color}
              disabled={disabled ? true : !isEditing}
              onChange={(val) => {
                onChange({ color: val });
              }}
            />
          </div>
        </div>
        <div>{renderLabelButtons()}</div>
      </div>
    );
  };

  return renderLabel();
};

export default React.memo(LabelFormItem);
