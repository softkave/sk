import { EditOutlined } from "@ant-design/icons";
import { Button, Input, Space } from "antd";
import { Form } from "antd";
import { FormikErrors, FormikTouched } from "formik";
import React from "react";
import { Check, Trash, X } from "react-feather";
import { IBlockLabel } from "../../models/block/block";
import { blockConstants } from "../../models/block/constants";
import ColorPicker from "../form/ColorPicker";
import FormError from "../form/FormError";
import StyledContainer from "../styled/Container";
import RoundEdgeTags from "../utilities/RoundEdgeTags";

export interface ILabelFormItemProps {
  value: IBlockLabel;
  onEdit: () => void;
  onDelete: () => void;
  onChange: (data: Partial<IBlockLabel>) => void;
  onDiscardChanges: () => void;
  onCommitChanges: () => void;

  isNew?: boolean;
  isEditing?: boolean;
  disabled?: boolean;
  touched?: FormikTouched<IBlockLabel>;
  errors?: FormikErrors<IBlockLabel>;
  style?: React.CSSProperties;
  handleBlur?: (
    field: keyof IBlockLabel,
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

  console.log({ props });

  const renderInputs = () => {
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
      </StyledContainer>
    );
  };

  const renderRegularLabel = () => {
    return (
      <StyledContainer
        s={{ flexDirection: "column", width: "100%", marginBottom: "8px" }}
      >
        <StyledContainer
          style={{
            color: "rgba(0,0,0,0.85)",
          }}
        >
          <RoundEdgeTags
            // contentColor="white"
            color={value.color}
            children={value.name}
          />
        </StyledContainer>
        <StyledContainer s={{ marginTop: "4px" }}>
          {value.description}
        </StyledContainer>
      </StyledContainer>
    );
  };

  const renderLabelButtons = () => {
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

  const renderLabel = () => {
    return (
      <StyledContainer
        s={{
          width: "100%",
          padding: "24px",
          flexDirection: "column",
          ...(style || {}),
        }}
      >
        <StyledContainer s={{ alignItems: "flex-start" }}>
          <StyledContainer
            s={{ flexDirection: "column", flex: 1, marginRight: "8px" }}
          >
            {isEditing ? renderInputs() : renderRegularLabel()}
          </StyledContainer>
          <StyledContainer s={{ flexDirection: "column", height: "100%" }}>
            <ColorPicker
              value={value.color}
              disabled={disabled ? true : !isEditing}
              onChange={(val) => {
                onChange({ color: val });
              }}
            />
          </StyledContainer>
        </StyledContainer>
        <StyledContainer>{renderLabelButtons()}</StyledContainer>
      </StyledContainer>
    );
  };

  return renderLabel();
};

export default LabelFormItem;
