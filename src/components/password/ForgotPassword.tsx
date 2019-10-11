import { Button, Form, Input, notification } from "antd";
import { Formik } from "formik";
import React from "react";
import * as yup from "yup";
import IOperation from "../../redux/operations/operation";
import { IForgotPasswordData } from "../../redux/operations/session/requestForgotPassword";
import FormError from "../form/FormError";
import { getGlobalError, submitHandler } from "../formik-utils";

const emailMismatchErrorMessage = "Email does not match";
const successMessage = `
  Request was successful,
  a change password link will been sent to your email address.`;

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .email()
    .required(),
  confirmEmail: yup
    .string()
    .oneOf([yup.ref("email")], emailMismatchErrorMessage)
    .required()
});

export interface IForgotPasswordProps {
  operation: IOperation;
  onSubmit: (values: IForgotPasswordData) => void | Promise<void>;
}

class ForgotPassword extends React.Component<IForgotPasswordProps> {
  public render() {
    const { onSubmit } = this.props;

    return (
      <Formik
        initialValues={{ email: undefined, confirmEmail: undefined }}
        validationSchema={validationSchema}
        onSubmit={(values, props) => {
          submitHandler(onSubmit, values, {
            ...props,
            fieldsToDelete: ["confirmEmail"],
            onSuccess() {
              notification.success({
                message: "Forgot Password",
                description: successMessage,
                duration: 0
              });
            }
          });
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting
        }) => {
          const globalError = getGlobalError(errors);

          return (
            <form onSubmit={handleSubmit}>
              {globalError && (
                <Form.Item>
                  <FormError error={globalError} />
                </Form.Item>
              )}
              <Form.Item
                label="Email Address"
                help={<FormError>{errors.email}</FormError>}
              >
                <Input
                  autoComplete="email"
                  name="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                />
              </Form.Item>
              <Form.Item
                label="Confirm Email Address"
                help={<FormError>{errors.confirmEmail}</FormError>}
              >
                <Input
                  autoComplete="email"
                  name="confirmEmail"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.confirmEmail}
                />
              </Form.Item>
              <Form.Item>
                <Button
                  block
                  type="primary"
                  htmlType="submit"
                  loading={isSubmitting}
                >
                  Change Password
                </Button>
              </Form.Item>
            </form>
          );
        }}
      </Formik>
    );
  }
}

export default ForgotPassword;
