import React from "react";
import { Input, Button, Checkbox, Form } from "antd";
import { Formik } from "formik";

import { userDescriptor } from "../../../models/user/descriptor";
import { constructSubmitHandler } from "../../form-utils.js";
import { userErrorFields } from "../../../models/user/userErrorMessages";
import { serverErrorFields } from "../../../models/serverErrorMessages";
import { NewFormAntD } from "../../NewFormAntD";

class Login extends React.Component {
  getSubmitHandler = () => {
    const { form, onSubmit } = this.props;

    return constructSubmitHandler({
      form,
      submitCallback: onSubmit,
      beforeProcess: () => this.setState({ isLoading: true, error: null }),
      afterErrorProcess: indexedErrors => {
        const formError =
          Array.isArray(indexedErrors.error) && indexedErrors.error[0]
            ? indexedErrors.error[0].message
            : null;
        this.setState({
          error: formError,
          isLoading: false
        });
      },
      transformErrorMap: [
        {
          field: userErrorFields.invalidLoginCredentials,
          toField: "error"
        },
        {
          field: serverErrorFields.serverError,
          toField: "error"
        }
      ]
    });
  };

  render() {
    const { form } = this.props;

    return (
      <Formik initialValues={null} onSubmit={null} validate={null}>
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting
        }) => {
          return (
            <form onSubmit={handleSubmit}>
              <Form.Item label="Email Address">
                <Input
                  autoComplete="email"
                  name="email"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.email}
                />
              </Form.Item>
              <Form.Item label="Password">
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
                  value={values.remember}
                >
                  Remember Me
                </Checkbox>
              </Form.Item>
              <Form.Item>
                <Button
                  block
                  type="primary"
                  htmlType="submit"
                  disabled={isSubmitting}
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
