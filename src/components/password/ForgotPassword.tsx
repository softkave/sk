import { Button, Form, Input } from "antd";
import { Formik } from "formik";
import React from "react";
import * as yup from "yup";
import cast from "../../utils/cast";
import FormError from "../form/FormError";
import { getGlobalError, IFormikFormErrors } from "../form/formik-utils";
import { FormBody } from "../form/FormStyledComponents";

const emailMismatchErrorMessage = "Email does not match";

const validationSchema = yup.object().shape({
  email: yup.string().email().required(),
  confirmEmail: yup
    .string()
    .oneOf([yup.ref("email")], emailMismatchErrorMessage)
    .required(),
});

export interface IForgotPasswordFormData {
  email: string;
}

interface IForgotPasswordFormInternalData extends IForgotPasswordFormData {
  confirmEmail: string;
}

export interface IForgotPasswordProps {
  onSubmit: (values: IForgotPasswordFormData) => void | Promise<void>;

  isSubmitting?: boolean;
  errors?: IFormikFormErrors<IForgotPasswordFormData>;
}

class ForgotPassword extends React.Component<IForgotPasswordProps> {
  public render() {
    const { onSubmit, isSubmitting, errors: externalErrors } = this.props;

    return (
      <Formik
        initialErrors={externalErrors as any}
        initialValues={cast<IForgotPasswordFormInternalData>({})}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          onSubmit({
            email: values.email,
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
        }) => {
          const globalError = getGlobalError(errors);

          return (
            <FormBody>
              <form onSubmit={handleSubmit}>
                <h2>Forgot Password</h2>
                {globalError && (
                  <Form.Item>
                    <FormError error={globalError} />
                  </Form.Item>
                )}
                <Form.Item
                  label="Email Address"
                  help={touched.email && <FormError>{errors.email}</FormError>}
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                >
                  <Input
                    autoComplete="email"
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.email}
                    placeholder="Enter your email address"
                    disabled={isSubmitting}
                  />
                </Form.Item>
                <Form.Item
                  label="Confirm Email Address"
                  help={
                    touched.confirmEmail && (
                      <FormError>{errors.confirmEmail}</FormError>
                    )
                  }
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                >
                  <Input
                    autoComplete="email"
                    name="confirmEmail"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.confirmEmail}
                    placeholder="Re-enter your email address"
                    disabled={isSubmitting}
                  />
                </Form.Item>
                <Form.Item>
                  <Button
                    block
                    type="primary"
                    htmlType="submit"
                    loading={isSubmitting}
                  >
                    {isSubmitting
                      ? "Sending Change Password Email"
                      : "Send Change Password Email"}
                  </Button>
                </Form.Item>
              </form>
            </FormBody>
          );
        }}
      </Formik>
    );
  }
}

export default ForgotPassword;
