import { css } from "@emotion/css";
import { InputNumber } from "antd";
import { Form } from "antd";
import { FormikErrors, FormikTouched } from "formik";
import React from "react";
import {
    fieldsConstants,
    IFeedbackFieldStringTypeMeta,
} from "../../models/fields/fields";
import StyledContainer from "../styled/Container";

export interface ITextFieldFormProps {
    value: IFeedbackFieldStringTypeMeta;
    onChange: (data: Partial<IFeedbackFieldStringTypeMeta>) => void;
    disabled?: boolean;
    touched?: FormikTouched<IFeedbackFieldStringTypeMeta>;
    errors?: FormikErrors<IFeedbackFieldStringTypeMeta>;
}

const TextFieldForm: React.FC<ITextFieldFormProps> = (props) => {
    const { touched, errors, value, onChange, disabled } = props;

    const divClass = css({
        display: "flex",
        flex: 1,
        marginRight: "16px",
    });

    return (
        <StyledContainer s={{ flexDirection: "column", width: "100%" }}>
            <div className={divClass}>
                <Form.Item
                    label="Min"
                    labelCol={{ span: 12 }}
                    wrapperCol={{ span: 12 }}
                >
                    <InputNumber
                        autoComplete="off"
                        // onBlur={(evt) => handleBlur && handleBlur("minLength", evt)}
                        onChange={(num) => {
                            onChange({ minLength: Number(num) });
                        }}
                        value={value.minLength}
                        disabled={disabled}
                        max={fieldsConstants.maxNameLength}
                    />
                </Form.Item>
            </div>
            <div className={divClass}>
                <Form.Item labelCol={{ span: 12 }} wrapperCol={{ span: 12 }}>
                    <InputNumber
                        autoComplete="off"
                        // onBlur={(evt) => handleBlur && handleBlur("maxLength", evt)}
                        onChange={(num) => {
                            onChange({ maxLength: Number(num) });
                        }}
                        value={value.maxLength}
                        disabled={disabled}
                        max={fieldsConstants.maxNameLength}
                    />
                </Form.Item>
            </div>
        </StyledContainer>
    );
};

export default TextFieldForm;
