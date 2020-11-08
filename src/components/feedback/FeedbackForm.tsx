import { Button, Checkbox, Form, Input } from "antd";
import React from "react";
import { ArrowLeft } from "react-feather";
import { blockConstants } from "../../models/block/constants";
import { IUser } from "../../models/user/user";
import FormError from "../forms/FormError";
import { getFormError, IFormikFormErrors } from "../forms/formik-utils";
import {
    formContentWrapperStyle,
    formInputContentWrapperStyle,
    StyledForm,
} from "../forms/FormStyledComponents";
import useFormHelpers from "../hooks/useFormHelpers";
import StyledContainer from "../styled/Container";
import { feedbackFormValidationSchema } from "./utils";

export interface IFeedbackFormValues {
    feedback: string;
    description?: string;
    notifyUserOnResolution?: boolean;
    notifyUserEmail?: string;
}

export type IFeedbackFormErrors = IFormikFormErrors<IFeedbackFormValues>;

export interface IFeedbackFormProps {
    value: IFeedbackFormValues;
    onSubmit: (values: IFeedbackFormValues) => void;
    onClose: () => void;
    user?: IUser;
    isSubmitting?: boolean;
    errors?: IFeedbackFormErrors;
}

const FeedbackForm: React.FC<IFeedbackFormProps> = (props) => {
    const {
        isSubmitting,
        value,
        user,
        onSubmit,
        onClose,
        errors: externalErrors,
    } = props;

    const { formik, formikChangedFieldsHelpers } = useFormHelpers({
        errors: externalErrors,
        formikProps: {
            onSubmit,
            initialValues: value,
            validationSchema: feedbackFormValidationSchema,
        },
    });

    const renderFeedbackInput = () => {
        const { touched, values, errors } = formik;

        return (
            <Form.Item
                label="Feedback"
                help={touched.feedback && <FormError error={errors.feedback} />}
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
            >
                <Input.TextArea
                    showCount
                    autoComplete="off"
                    onChange={(evt) => {
                        formik.setFieldValue("feedback", evt.target.value);
                        formikChangedFieldsHelpers.addField("feedback");
                    }}
                    value={values.feedback}
                    placeholder="Enter your feedback here as concise as possible"
                    autoSize={{ minRows: 2, maxRows: 4 }}
                    maxLength={blockConstants.maxNameLength}
                />
            </Form.Item>
        );
    };

    const renderDescriptionInput = () => {
        const { touched, errors, values } = formik;

        return (
            <Form.Item
                label="Description"
                help={
                    touched.description && (
                        <FormError error={errors.description} />
                    )
                }
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
            >
                <Input.TextArea
                    showCount
                    autoComplete="off"
                    onChange={(evt) => {
                        formik.setFieldValue("description", evt.target.value);
                        formikChangedFieldsHelpers.addField("description");
                    }}
                    value={values.description}
                    placeholder="You can enter more details here"
                    autoSize={{ minRows: 4, maxRows: 8 }}
                    maxLength={blockConstants.maxDescriptionLength}
                />
            </Form.Item>
        );
    };

    const renderShouldNotifiyUserInput = () => {
        const { values } = formik;

        if (!user) {
            return null;
        }

        return (
            <Form.Item
                label="Board Color Avatar"
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                style={{ width: "100%" }}
            >
                <Checkbox
                    checked={values.notifyUserOnResolution}
                    onChange={(evt) => {
                        const checked = evt.target.value;

                        formik.setFieldValue(
                            "notifyUserOnResolution",
                            evt.target.value
                        );
                        formikChangedFieldsHelpers.addField(
                            "notifyUserOnResolution"
                        );

                        if (!checked) {
                            formik.setFieldValue("notifyUserEmail", "");
                            formikChangedFieldsHelpers.addField(
                                "notifyUserEmail"
                            );
                        } else if (checked && user) {
                            formik.setFieldValue("notifyUserEmail", user.email);
                            formikChangedFieldsHelpers.addField(
                                "notifyUserEmail"
                            );
                        }
                    }}
                >
                    Should we notify you when we resolve this feedback?
                </Checkbox>
            </Form.Item>
        );
    };

    const renderUserEmailInput = () => {
        const { touched, errors, values } = formik;

        return (
            <Form.Item
                label="Email Address"
                help={
                    touched.notifyUserEmail && (
                        <FormError error={errors.notifyUserEmail} />
                    )
                }
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
                extra="Enter your email address if you want us to notify you when we resolve your feedback"
            >
                <Input
                    autoComplete="email"
                    onChange={(evt) => {
                        formik.setFieldValue(
                            "notifyUserEmail",
                            evt.target.value
                        );
                        formikChangedFieldsHelpers.addField("notifyUserEmail");
                    }}
                    value={values.notifyUserEmail}
                    placeholder="You email address"
                    disabled={!!user && !values.notifyUserOnResolution}
                />
            </Form.Item>
        );
    };

    const getSubmitLabel = () => {
        if (isSubmitting) {
            return "Sending your Feedback";
        } else {
            return "Send Feedback";
        }
    };

    const renderControls = () => {
        return (
            <StyledContainer>
                <Button
                    block
                    type="primary"
                    htmlType="submit"
                    loading={isSubmitting}
                    disabled={!formikChangedFieldsHelpers.hasChanges()}
                >
                    {getSubmitLabel()}
                </Button>
            </StyledContainer>
        );
    };

    const renderForm = () => {
        const { errors } = formik;
        const globalError = getFormError(errors);

        return (
            <StyledForm onSubmit={formik.handleSubmit}>
                <StyledContainer s={formContentWrapperStyle}>
                    <StyledContainer s={formInputContentWrapperStyle}>
                        <StyledContainer s={{ paddingBottom: "16px" }}>
                            <Button
                                style={{ cursor: "pointer" }}
                                onClick={onClose}
                                className="icon-btn"
                            >
                                <ArrowLeft />
                            </Button>
                        </StyledContainer>
                        {globalError && (
                            <Form.Item>
                                <FormError error={globalError} />
                            </Form.Item>
                        )}
                        {renderFeedbackInput()}
                        {renderDescriptionInput()}
                        {renderShouldNotifiyUserInput()}
                        {renderUserEmailInput()}
                    </StyledContainer>
                    {renderControls()}
                </StyledContainer>
            </StyledForm>
        );
    };

    return renderForm();
};

export default React.memo(FeedbackForm);
