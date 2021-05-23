import { css } from "@emotion/css";
import { Button, Divider, Form, Input } from "antd";
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
    confirmEmail: userValidationSchemas.confirmEmail,
    password: userValidationSchemas.password,
    confirmPassword: userValidationSchemas.confirmPassword,
});

export interface IUpdateUserDataFormData {
    name?: string;
    email?: string;
    password?: string;
    color?: string;
}

interface IUpdateUserDataFormInternalData extends IUpdateUserDataFormData {
    confirmEmail?: string;
    confirmPassword?: string;
}

export interface IUpdateUserDataFormProps {
    user: IUser;
    onSubmit: (values: IUpdateUserDataFormData) => void | Promise<void>;
    errors?: IFormikFormErrors<IUpdateUserDataFormData>;
    isSubmitting?: boolean;
}

const UpdateUserFormData: React.FC<IUpdateUserDataFormProps> = (props) => {
    const { user, onSubmit, isSubmitting, errors: externalErrors } = props;

    const { formik } = useFormHelpers({
        errors: externalErrors,
        formikProps: {
            validationSchema,
            initialValues: {
                name: user.name,
                email: user.email,
                color: user.color,
            } as IUpdateUserDataFormInternalData,
            onSubmit: (data) => {
                onSubmit({
                    email: data.email,
                    name: data.name,
                    password: data.password,
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
                label={messages.emailAddressLabel}
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
            <Form.Item
                required
                label={messages.confirmEmailAddressLabel}
                help={
                    formik.touched?.confirmEmail &&
                    formik.errors?.confirmEmail && (
                        <FormError error={formik.errors.confirmEmail} />
                    )
                }
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
            >
                <Input
                    autoComplete="email"
                    name="confirmEmail"
                    value={formik.values.confirmEmail}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    disabled={isSubmitting}
                    placeholder={messages.confirmEmailAddressPlaceholder}
                />
            </Form.Item>
        </React.Fragment>
    );

    const passwordNode = (
        <React.Fragment>
            <Form.Item
                required
                label={messages.passwordLabel}
                help={
                    formik.touched?.password && formik.errors?.password ? (
                        <FormError error={formik.errors?.password} />
                    ) : (
                        messages.passwordMinCharacters
                    )
                }
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
            >
                <Input.Password
                    visibilityToggle
                    autoComplete="new-password"
                    name="password"
                    value={formik.values.password}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    disabled={isSubmitting}
                    placeholder={messages.passwordPlaceholder}
                    maxLength={userConstants.maxPasswordLength}
                />
            </Form.Item>
            <Form.Item
                required
                label={messages.confirmPasswordLabel}
                help={
                    formik.touched?.confirmPassword &&
                    formik.errors?.confirmPassword && (
                        <FormError error={formik.errors.confirmPassword} />
                    )
                }
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
            >
                <Input.Password
                    visibilityToggle
                    autoComplete="new-password"
                    name="confirmPassword"
                    value={formik.values.confirmPassword}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    disabled={isSubmitting}
                    placeholder={messages.confirmPasswordPlaceholder}
                    maxLength={userConstants.maxPasswordLength}
                />
            </Form.Item>
        </React.Fragment>
    );

    return (
        <FormBody>
            <form onSubmit={formik.handleSubmit}>
                {globalError && (
                    <Form.Item>
                        <FormError error={globalError} />
                    </Form.Item>
                )}
                <FormSection>{nameNode}</FormSection>
                <Divider />
                <FormSection>{colorNode}</FormSection>
                <Divider />
                <FormSection>{emailNode}</FormSection>
                <Divider />
                <FormSection>{passwordNode}</FormSection>
                <Form.Item
                    className={css({
                        marginTop: "24px",
                    })}
                >
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={isSubmitting}
                        className={css({ marginTop: "32px" })}
                    >
                        {isSubmitting ? "Updating Profile" : "Update Profile"}
                    </Button>
                </Form.Item>
            </form>
        </FormBody>
    );
};

export default UpdateUserFormData;
