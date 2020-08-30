import { Button, Input, Space, Typography } from "antd";
import { TextAreaProps } from "antd/lib/input";
import React from "react";
import { Check, Edit3, X as CloseIcon } from "react-feather";
import Editable, { EditableRenderFn } from "./Editable";

export interface IInputWithControlsProps {
    onChange: (val: string) => void;
    revertChanges: () => void;

    value?: string;
    placeholder?: string;
    disabled?: boolean;
    useTextArea?: boolean;
    noControls?: boolean;
    noEditable?: boolean;
    autoComplete?: string;
    autoSize?: TextAreaProps["autoSize"];
}

const InputWithControls: React.FC<IInputWithControlsProps> = (props) => {
    const {
        value,
        placeholder,
        disabled,
        useTextArea,
        noEditable,
        noControls,
        autoComplete,
        onChange,
        revertChanges,
        autoSize,
    } = props;

    const input = useTextArea ? (
        <Input.TextArea
            autoComplete={autoComplete}
            onChange={(evt) => {
                onChange(evt.target.value);
            }}
            value={value}
            placeholder={placeholder}
            disabled={disabled}
            autoSize={autoSize}
        />
    ) : (
        <Input
            autoComplete={autoComplete}
            onChange={(evt) => {
                onChange(evt.target.value);
            }}
            value={value}
            placeholder={placeholder}
            disabled={disabled}
        />
    );

    let content: React.ReactElement = <React.Fragment />;

    const renderFn: EditableRenderFn = React.useCallback(
        (isEditing, setEditing) => {
            if (!isEditing) {
                return (
                    <Space direction="vertical">
                        <Typography.Paragraph>{value}</Typography.Paragraph>
                        {!noControls && (
                            <Space>
                                <Button
                                    disabled={disabled}
                                    icon={
                                        <Edit3
                                            style={{
                                                width: "14px",
                                                height: "14px",
                                            }}
                                        />
                                    }
                                    onClick={() => setEditing(true)}
                                    htmlType="button"
                                    className="icon-btn"
                                />
                            </Space>
                        )}
                    </Space>
                );
            }

            return (
                <Space direction="vertical">
                    {input}
                    {!noControls && (
                        <Space>
                            <Button
                                icon={
                                    <Check
                                        style={{
                                            width: "14px",
                                            height: "14px",
                                        }}
                                    />
                                }
                                onClick={() => setEditing(false)}
                                htmlType="button"
                                disabled={disabled}
                                className="icon-btn"
                            />
                            <Button
                                onClick={revertChanges}
                                icon={
                                    <CloseIcon
                                        style={{
                                            width: "14px",
                                            height: "14px",
                                        }}
                                    />
                                }
                                disabled={disabled}
                                htmlType="button"
                                className="icon-btn"
                            />
                        </Space>
                    )}
                </Space>
            );
        },
        []
    );

    if (!noEditable) {
        content = <Editable disabled={disabled} render={renderFn} />;
    } else {
        content = input;
    }

    return content;
};

InputWithControls.defaultProps = { autoSize: { minRows: 4, maxRows: 8 } };

export default React.memo(InputWithControls);
