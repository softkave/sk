import { Button, Form, Input, Typography } from "antd";
import React from "react";
import * as yup from "yup";
import { messages } from "../../models/messages";
import { userConstants } from "../../models/user/constants";
import { IUser } from "../../models/user/user";
import ColorPicker from "../forms/ColorPicker";
import FormError from "../forms/FormError";
import { getFormError, IFormikFormErrors } from "../forms/formik-utils";
import { FormBody, FormSection } from "../forms/FormStyledComponents";
import useFormHelpers from "../hooks/useFormHelpers";
import { userValidationSchemas } from "./validation";

const validationSchema = yup.object().shape({
    name: userValidationSchemas.name,
    email: userValidationSchemas.email,
});

export interface IUpdateUserDataFormData {
    name?: string;
    email?: string;
    color?: string;
}

export interface IUpdateUserDataFormProps {
    user: IUser;
    onSubmit: (values: IUpdateUserDataFormData) => void | Promise<void>;
    errors?: IFormikFormErrors<IUpdateUserDataFormData>;
    isSubmitting?: boolean;
}

const UpdateUserFormData: React.FC<IUpdateUserDataFormProps> = (props) => {
    const { user, onSubmit, isSubmitting, errors: externalErrors } = props;

    const { formik, formikChangedFieldsHelpers } = useFormHelpers({
        errors: externalErrors,
        formikProps: {
            validationSchema,
            initialValues: {
                name: user.name,
                email: user.email,
                color: user.color,
            } as IUpdateUserDataFormData,
            onSubmit: (data) => {
                onSubmit({
                    email: data.email,
                    name: data.name,
                    color: data.color,
                });
            },
        },
    });

    const globalError = getFormError(formik.errors);

    const nameNode = (
        <Form.Item
            required
            label={messages.nameLabel}
            help={
                formik.touched?.name &&
                formik.errors?.name && <FormError error={formik.errors.name} />
            }
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
        >
            <Input
                autoComplete="name"
                name="name"
                value={formik.values.name}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                placeholder={messages.namePlaceHolder}
                disabled={isSubmitting}
                maxLength={userConstants.maxNameLength}
            />
        </Form.Item>
    );

    const colorNode = (
        <Form.Item
            required
            label={messages.colorLabel}
            labelCol={{ span: 24 }}
            wrapperCol={{ span: 24 }}
        >
            <div style={{ marginLeft: "4px" }}>
                <ColorPicker
                    value={formik.values.color}
                    disabled={isSubmitting}
                    onChange={(color) => formik.setFieldValue("color", color)}
                />
            </div>
        </Form.Item>
    );

    const emailNode = (
        <React.Fragment>
            <Form.Item
                required
                label={messages.changeEmailLabel}
                help={
                    formik.touched?.email &&
                    formik.errors?.email && (
                        <FormError error={formik.errors.email} />
                    )
                }
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
            >
                <Input
                    autoComplete="email"
                    name="email"
                    value={formik.values.email}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    disabled={isSubmitting}
                    placeholder={messages.emailAddressPlaceholder}
                />
            </Form.Item>
        </React.Fragment>
    );

    return (
        <FormBody>
            <form onSubmit={formik.handleSubmit}>
                <Typography.Title level={4}>Profile</Typography.Title>
                {globalError && (
                    <Form.Item>
                        <FormError error={globalError} />
                    </Form.Item>
                )}
                <FormSection>{nameNode}</FormSection>
                <FormSection>{colorNode}</FormSection>
                <FormSection>{emailNode}</FormSection>
                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={isSubmitting}
                    >
                        {isSubmitting ? "Updating Profile" : "Update Profile"}
                    </Button>
                </Form.Item>
            </form>
        </FormBody>
    );
};

export default UpdateUserFormData;
