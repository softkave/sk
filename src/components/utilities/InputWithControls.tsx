import { EditOutlined } from "@ant-design/icons";
import { Button, Input, Space, Typography } from "antd";
import { TextAreaProps } from "antd/lib/input";
import { ParagraphProps } from "antd/lib/typography/Paragraph";
import React from "react";
import { Check, X as CloseIcon } from "react-feather";
import StyledContainer from "../styled/Container";
import Editable, { EditableRenderFn } from "./Editable";

export interface IInputWithControlsProps {
    onChange: (val: string) => void;
    revertChanges: () => void;

    value?: string;
    placeholder?: string;
    disabled?: boolean;
    useTextArea?: boolean;
    hideControls?: boolean;
    inputOnly?: boolean;
    bordered?: boolean;
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
        inputOnly,
        hideControls,
        bordered,
        autoComplete,
        onChange,
        revertChanges,
        autoSize,
        paragraphProps,
    } = props;

    const input = React.useMemo(
        () =>
            useTextArea ? (
                <Input.TextArea
                    bordered={bordered}
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
                    bordered={bordered}
                    autoComplete={autoComplete}
                    onChange={(evt) => {
                        onChange(evt.target.value);
                    }}
                    value={value}
                    placeholder={placeholder}
                    disabled={disabled}
                />
            ),
        [
            useTextArea,
            autoComplete,
            value,
            placeholder,
            disabled,
            autoSize,
            onChange,
            bordered,
        ]
    );

    let content: React.ReactElement = <React.Fragment />;

    const renderFn: EditableRenderFn = React.useCallback(
        (isEditing, setEditing) => {
            if (!isEditing && !hideControls) {
                return (
                    <Space direction="vertical" style={{ width: "100%" }}>
                        <Typography.Paragraph {...paragraphProps}>
                            {value}
                        </Typography.Paragraph>
                        <div>
                            <Button
                                disabled={disabled}
                                icon={<EditOutlined />}
                                onClick={() => setEditing(true)}
                                htmlType="button"
                                className="icon-btn"
                            />
                        </div>
                    </Space>
                );
            }

            return (
                <Space direction="vertical" style={{ width: "100%" }}>
                    {input}
                    {!hideControls && (
                        <Space>
                            <Button
                                icon={<Check />}
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
                                icon={<CloseIcon />}
                                disabled={disabled}
                                htmlType="button"
                                className="icon-btn"
                            />
                        </Space>
                    )}
                </Space>
            );
        },
        [disabled, hideControls, revertChanges, value, input, paragraphProps]
    );

    if (!inputOnly) {
        content = <Editable disabled={disabled} render={renderFn} />;
    } else {
        content = input;
    }

    return <StyledContainer>{content}</StyledContainer>;
};

InputWithControls.defaultProps = {
    bordered: true,
    autoSize: { minRows: 4, maxRows: 8 },
};

export default React.memo(InputWithControls);
