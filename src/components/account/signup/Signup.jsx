import React from "react";
import { Input, Button, Form } from "antd";
import { Formik } from "formik";

import { userDescriptor } from "../../../models/user/descriptor";
import { makeConfirmValidator } from "../../../utils/descriptor";

const passwordExtraInfo = "Minimum of 5 characters";

const emailMismatchErrorMessage = "Email does not match";
const passwordMismatchErrorMessage = "Password do not match";

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.confirmPasswordValidator = makeConfirmValidator(
      "password",
      "confirmPassword",
      props.form,
      passwordMismatchErrorMessage
    );

    this.confirmEmailValidator = makeConfirmValidator(
      "email",
      "confirmEmail",
      props.form,
      emailMismatchErrorMessage
    );
  }

  render() {
    const { onSubmit } = this.props;

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
              <Form.Item label="Name">
                <Input
                  autoComplete="name"
                  name="name"
                  value={values.name}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
              </Form.Item>
              <Form.Item label="Email Address">
                <Input
                  autoComplete="email"
                  name="email"
                  value={values.email}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
              </Form.Item>
              <Form.Item label="Confirm Email Address">
                <Input
                  autoComplete="email"
                  name="confirmEmail"
                  value={values.confirmEmail}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
              </Form.Item>
              <Form.Item label="Password" extra={passwordExtraInfo}>
                <Input.Password
                  visibilityToggle
                  autoComplete="new-password"
                  name="password"
                  value={values.password}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
              </Form.Item>
              <Form.Item label="Confirm Password">
                <Input.Password
                  visibilityToggle
                  autoComplete="new-password"
                  name="confirmPassword"
                  value={values.confirmPassword}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
              </Form.Item>
              <Form.Item>
                <Button
                  block
                  type="primary"
                  htmlType="submit"
                  disabled={isSubmitting}
                >
                  Create Account
                </Button>
              </Form.Item>
            </form>
          );
        }}
      </Formik>
    );
  }
}

export default Signup;
