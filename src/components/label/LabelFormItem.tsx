/*eslint no-useless-computed-key: "off"*/

import { Button, Input, Space, Tag, Typography } from "antd";
import { Form } from "antd";
import { FormikErrors, FormikTouched } from "formik";
import React from "react";
import { Check, Edit3, Trash2, X as CloseIcon } from "react-feather";
import { IBlockLabel } from "../../models/block/block";
import { blockConstants } from "../../models/block/constants";
import ColorPicker from "../forms/ColorPicker";
import FormError from "../forms/FormError";
import StyledContainer from "../styled/Container";

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

    const renderInputs = () => {
        return (
            <StyledContainer s={{ flexDirection: "column", width: "100%" }}>
                {value.name && (
                    <Form.Item style={{ marginBottom: 8 }}>
                        <Tag color={value.color}>{value.name}</Tag>
                    </Form.Item>
                )}
                <Form.Item
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                    help={
                        touched?.name &&
                        errors?.name && <FormError error={errors?.name} />
                    }
                    style={{ marginBottom: 8 }}
                >
                    <Input
                        autoComplete="off"
                        onBlur={(evt) => handleBlur && handleBlur("name", evt)}
                        onChange={(
                            event: React.ChangeEvent<HTMLInputElement>
                        ) => {
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
                        errors?.description && (
                            <FormError error={errors.description} />
                        )
                    }
                    style={{ marginBottom: 8 }}
                >
                    <Input.TextArea
                        autoSize={{ minRows: 2, maxRows: 6 }}
                        autoComplete="off"
                        onBlur={(evt) =>
                            handleBlur && handleBlur("description", evt)
                        }
                        onChange={(
                            event: React.ChangeEvent<HTMLTextAreaElement>
                        ) => {
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
                s={{
                    flexDirection: "column",
                    width: "100%",
                    marginBottom: "8px",
                }}
            >
                <StyledContainer>
                    <Tag color={value.color}>{value.name}</Tag>
                </StyledContainer>
                <Typography.Paragraph
                    type="secondary"
                    style={{ margin: 0, marginTop: "4px" }}
                >
                    {value.description}
                </Typography.Paragraph>
            </StyledContainer>
        );
    };

    const renderLabelButtons = () => {
        return (
            <Space>
                {isEditing && (
                    <Button
                        icon={
                            <Check style={{ width: "14px", height: "14px" }} />
                        }
                        onClick={onCommitChanges}
                        htmlType="button"
                        disabled={disabled || value.name.length === 0}
                        className="icon-btn"
                    />
                )}
                {isEditing && (
                    <Button
                        onClick={onDiscardChanges}
                        icon={
                            <CloseIcon
                                style={{ width: "14px", height: "14px" }}
                            />
                        }
                        disabled={isNew || value.name.length === 0}
                        htmlType="button"
                        className="icon-btn"
                    />
                )}
                {!isEditing && (
                    <Button
                        disabled={disabled}
                        icon={
                            <Edit3 style={{ width: "14px", height: "14px" }} />
                        }
                        onClick={onEdit}
                        htmlType="button"
                        className="icon-btn"
                    />
                )}
                <Button
                    disabled={disabled}
                    icon={<Trash2 style={{ width: "14px", height: "14px" }} />}
                    onClick={() => onDelete()}
                    htmlType="button"
                    className="icon-btn"
                />
            </Space>
        );
    };

    const renderLabel = () => {
        return (
            <StyledContainer
                s={{
                    width: "100%",
                    padding: "16px",
                    flexDirection: "column",

                    ["& button"]: {
                        width: "26px !important",
                        height: "24.2px !important",
                    },

                    ...(style || {}),
                }}
            >
                <StyledContainer s={{ alignItems: "flex-start" }}>
                    <StyledContainer
                        s={{
                            flexDirection: "column",
                            flex: 1,
                            marginRight: "8px",
                        }}
                    >
                        {isEditing ? renderInputs() : renderRegularLabel()}
                    </StyledContainer>
                    <StyledContainer
                        s={{ flexDirection: "column", height: "100%" }}
                    >
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

export default React.memo(LabelFormItem);
