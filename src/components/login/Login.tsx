import { Button, Checkbox, Form, Input } from "antd";
import { Formik } from "formik";
import React from "react";
import * as yup from "yup";
import { userConstants } from "../../models/user/constants";
import cast from "../../utils/cast";
import FormError from "../form/FormError";
import { getGlobalError, IFormikFormErrors } from "../form/formik-utils";
import { FormBody } from "../form/FormStyledComponents";
import useInsertFormikErrors from "../hooks/useInsertFormikErrors";

const validationSchema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().max(userConstants.maxPasswordLength).required(),
});

export interface ILoginFormValues {
  email: string;
  password: string;
  remember: boolean;
}

export interface ILoginProps {
  onSubmit: (values: ILoginFormValues) => void | Promise<void>;

  isSubmitting?: boolean;
  errors?: IFormikFormErrors<ILoginFormValues>;
}

const Login: React.FC<ILoginProps> = (props) => {
  const { onSubmit, isSubmitting, errors: externalErrors } = props;

  const formikRef = useInsertFormikErrors(externalErrors);

  return (
    <Formik
      initialValues={cast<ILoginFormValues>({})}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
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
              <h2>Login</h2>
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
                  disabled={isSubmitting}
                  placeholder="Enter your email address"
                />
              </Form.Item>
              <Form.Item
                required
                label="Password"
                help={
                  touched.password && <FormError>{errors.password}</FormError>
                }
                labelCol={{ span: 24 }}
                wrapperCol={{ span: 24 }}
              >
                <Input.Password
                  visibilityToggle
                  autoComplete="current-password"
                  name="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password}
                  disabled={isSubmitting}
                  placeholder="Enter your password"
                  maxLength={userConstants.maxPasswordLength}
                />
              </Form.Item>
              <Form.Item>
                <Checkbox
                  name="remember"
                  onChange={handleChange}
                  checked={values.remember}
                  disabled={isSubmitting}
                >
                  Remember Me
                </Checkbox>
              </Form.Item>
              <Form.Item>
                <Button
                  block
                  type="primary"
                  htmlType="submit"
                  loading={isSubmitting}
                >
                  {isSubmitting ? "Logging In" : "Login"}
                </Button>
              </Form.Item>
            </form>
          </FormBody>
        );
      }}
    </Formik>
  );
};

export default React.memo(Login);
