/*eslint no-useless-computed-key: "off"*/

import { Button, Input, Space, Typography } from "antd";
import { TextAreaProps } from "antd/lib/input";
import { ParagraphProps } from "antd/lib/typography/Paragraph";
import React from "react";
import { Check, Edit3, X as CloseIcon } from "react-feather";
import StyledContainer from "../styled/Container";
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
    paragraphProps?: Partial<ParagraphProps>;
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
        paragraphProps,
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
                    <Space direction="vertical" style={{ width: "100%" }}>
                        <Typography.Paragraph {...paragraphProps}>
                            {value}
                        </Typography.Paragraph>
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
                <Space direction="vertical" style={{ width: "100%" }}>
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
                                onClick={() => {
                                    revertChanges();
                                    setEditing(false);
                                }}
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
        [disabled, noControls, revertChanges, value, input, paragraphProps]
    );

    if (!noEditable) {
        content = <Editable disabled={disabled} render={renderFn} />;
    } else {
        content = input;
    }

    return (
        <StyledContainer
            s={{
                ["& button"]: {
                    width: "26px !important",
                    height: "24.2px !important",
                },
            }}
        >
            {content}
        </StyledContainer>
    );
};

InputWithControls.defaultProps = { autoSize: { minRows: 4, maxRows: 8 } };

export default React.memo(InputWithControls);
