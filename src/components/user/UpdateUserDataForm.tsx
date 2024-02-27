import { Button, Form, Input, Typography } from "antd";
import React from "react";
import * as yup from "yup";
import { appMessages } from "../../models/messages";
import { userConstants } from "../../models/user/constants";
import { IUser } from "../../models/user/types";
import { IFormikFormErrors, getFormError } from "../forms/formik-utils";
import useFormHelpers from "../hooks/useFormHelpers";
import FormFieldError from "../utils/form/FormFieldError";
import ColorPicker from "../utils/form/inputs/ColorPicker";
import { formClasses, formClassname, formSectionClassname } from "../utils/form/styles";
import { userValidationSchemas } from "./validation";

const validationSchema = yup.object().shape({
  name: userValidationSchemas.name,
  email: userValidationSchemas.email,
});

export interface IUpdateUserDataFormData {
  firstName?: string;
  lastName?: string;
  email?: string;
  color?: string;
}

export interface IUpdateUserDataFormProps {
  user: IUser;
  onSubmit: (values: IUpdateUserDataFormData) => void | Promise<void>;
  errors?: IFormikFormErrors<IUpdateUserDataFormData>;
  isSubmitting?: boolean;
  isDisabled?: boolean;
}

const UpdateUserFormData: React.FC<IUpdateUserDataFormProps> = (props) => {
  const { user, onSubmit, isSubmitting, isDisabled, errors: externalErrors } = props;

  // TODO: disable submit buttons on profile and password forms
  // until there are changes
  const { formik } = useFormHelpers({
    errors: externalErrors,
    formikProps: {
      validationSchema,
      initialValues: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        color: user.color,
      } as IUpdateUserDataFormData,
      onSubmit: (data) => {
        onSubmit({
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          color: data.color,
        });
      },
    },
  });

  const isFormDisabled = isDisabled || isSubmitting;
  const globalError = getFormError(formik.errors);

  const firstNameNode = (
    <Form.Item
      required
      label={appMessages.firstNameLabel}
      help={
        formik.touched?.firstName &&
        formik.errors?.firstName && <FormFieldError error={formik.errors.firstName} />
      }
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
    >
      <Input
        autoComplete="given-name"
        name="firstName"
        value={formik.values.firstName}
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
        placeholder={appMessages.firstNamePlaceHolder}
        disabled={isFormDisabled}
        maxLength={userConstants.maxNameLength}
      />
    </Form.Item>
  );

  const lastNameNode = (
    <Form.Item
      required
      label={appMessages.lastNameLabel}
      help={
        formik.touched?.lastName &&
        formik.errors?.lastName && <FormFieldError error={formik.errors.lastName} />
      }
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
    >
      <Input
        autoComplete="family-name"
        name="lastName"
        value={formik.values.lastName}
        onBlur={formik.handleBlur}
        onChange={formik.handleChange}
        placeholder={appMessages.lastNamePlaceHolder}
        disabled={isFormDisabled}
        maxLength={userConstants.maxNameLength}
      />
    </Form.Item>
  );

  const colorNode = (
    <Form.Item
      required
      label={appMessages.colorLabel}
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
    >
      <div style={{ marginLeft: "4px" }}>
        <ColorPicker
          value={formik.values.color}
          disabled={isFormDisabled}
          onChange={(color) => formik.setFieldValue("color", color)}
        />
      </div>
    </Form.Item>
  );

  const emailNode = (
    <React.Fragment>
      <Form.Item
        required
        label={appMessages.changeEmailLabel}
        help={
          formik.touched?.email &&
          formik.errors?.email && <FormFieldError error={formik.errors.email} />
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
          disabled={isFormDisabled}
          placeholder={appMessages.emailAddressPlaceholder}
        />
      </Form.Item>
    </React.Fragment>
  );

  return (
    <form onSubmit={formik.handleSubmit} className={formClassname} style={{ height: "auto" }}>
      <div className={formClasses.formContent}>
        <Form.Item>
          <Typography.Title level={4}>Profile</Typography.Title>
        </Form.Item>
        {globalError && (
          <Form.Item>
            <FormFieldError error={globalError} />
          </Form.Item>
        )}
        <div className={formSectionClassname}>{firstNameNode}</div>
        <div className={formSectionClassname}>{lastNameNode}</div>
        <div className={formSectionClassname}>{colorNode}</div>
        <div className={formSectionClassname}>{emailNode}</div>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isSubmitting}>
            {isSubmitting ? "Updating Profile" : "Update Profile"}
          </Button>
        </Form.Item>
      </div>
    </form>
  );
};

export default UpdateUserFormData;
