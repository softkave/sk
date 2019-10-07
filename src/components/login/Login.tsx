import { Button, Checkbox, Form, Input } from "antd";
import { Formik } from "formik";
import React from "react";
import * as yup from "yup";
import { userConstants } from "../../models/user/constants";
import { ILoginUserData } from "../../redux/operations/session/loginUser";
import FormError from "../form/FormError";
import { getGlobalError, submitHandler } from "../formik-utils";

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .email()
    .required(),
  password: yup
    .string()
    .max(userConstants.maxPasswordLength)
    .required()
});

export interface ILoginProps {
  onSubmit: (values: ILoginUserData) => void | Promise<void>;
}

class Login extends React.Component<ILoginProps> {
  public render() {
    const { onSubmit } = this.props;

    return (
      <Formik
        initialValues={{
          email: undefined,
          password: undefined,
          remember: true
        }}
        onSubmit={(values, props) => submitHandler(onSubmit, values, props)}
        validationSchema={validationSchema}
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
                label="Password"
                help={<FormError>{errors.password}</FormError>}
              >
                <Input.Password
                  visibilityToggle
                  autoComplete="current-password"
                  name="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password}
                />
              </Form.Item>
              <Form.Item>
                <Checkbox
                  name="remember"
                  onChange={handleChange}
                  checked={values.remember}
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
                  Login
                </Button>
              </Form.Item>
            </form>
          );
        }}
      </Formik>
    );
  }
}

export default Login;
