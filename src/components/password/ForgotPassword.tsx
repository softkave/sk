import { Button, Form, Input } from "antd";
import { Formik } from "formik";
import React from "react";
import * as yup from "yup";
import cast from "../../utils/cast";
import FormError from "../form/FormError";
import { getGlobalError, IFormikFormErrors } from "../form/formik-utils";
import { FormBody } from "../form/FormStyledComponents";
import useInsertFormikErrors from "../hooks/useInsertFormikErrors";

// TODO:
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

const ForgotPassword: React.FC<IForgotPasswordProps> = (props) => {
  const { onSubmit, isSubmitting, errors: externalErrors } = props;

  const formikRef = useInsertFormikErrors(externalErrors);

  return (
    <Formik
      initialValues={cast<IForgotPasswordFormInternalData>({})}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        onSubmit({
          email: values.email,
        });
      }}
    >
      {(formikProps) => {
        const {
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
        } = formikProps;
        formikRef.current = formikProps;
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
                required
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
                required
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
};

export default ForgotPassword;
