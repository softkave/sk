import { EditOutlined } from "@ant-design/icons";
import { Button, Form, Input, Space, Typography } from "antd";
import { FormikErrors, FormikTouched } from "formik";
import React from "react";
import { Check, X as CloseIcon, Trash2 } from "react-feather";
import { blockConstants } from "../../models/block/constants";
import { IBoardStatusResolutionInput } from "../../models/board/types";
import FormFieldError from "../utils/form/FormFieldError";

export interface IResolutionFormItemProps {
  value: IBoardStatusResolutionInput;
  onEdit: () => void;
  onDelete: () => void;
  onChange: (data: Partial<IBoardStatusResolutionInput>) => void;
  onDiscardChanges: () => void;
  onCommitChanges: () => void;

  isNew?: boolean;
  isEditing?: boolean;
  disabled?: boolean;
  touched?: FormikTouched<IBoardStatusResolutionInput>;
  errors?: FormikErrors<IBoardStatusResolutionInput>;
  style?: React.CSSProperties;
  handleBlur?: (
    field: keyof IBoardStatusResolutionInput,
    event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

const ResolutionFormItem: React.FC<IResolutionFormItemProps> = (props) => {
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

  const renderEditingStatus = () => {
    return (
      <div style={{ flexDirection: "column", width: "100%" }}>
        <Form.Item
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          help={touched?.name && errors?.name && <FormFieldError error={errors?.name} />}
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
            placeholder="Enter resolution"
            disabled={disabled}
            maxLength={blockConstants.maxLabelNameLength}
          />
        </Form.Item>
        <Form.Item
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          help={
            touched?.description &&
            errors?.description && <FormFieldError error={errors.description} />
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
            placeholder="Enter resolution description"
            maxLength={blockConstants.maxLabelDescriptionLength}
            disabled={disabled}
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
        <Typography.Text
          style={{
            color: "rgba(0,0,0,0.85)",
            textTransform: "capitalize",
          }}
        >
          {value.name}
        </Typography.Text>
        {/* <Tag
          style={{
            textTransform: "capitalize",
          }}
        >
          {value.name}
        </Tag> */}
        <Typography.Paragraph type="secondary" style={{ margin: 0, marginTop: "8px" }}>
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
        width: "100%",
        flexDirection: "column",

        ...(style || {}),
      }}
    >
      <div
        style={{
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
      </div>
      <div>{renderStatusButtons()}</div>
    </div>
  );
};

export default React.memo(ResolutionFormItem);
