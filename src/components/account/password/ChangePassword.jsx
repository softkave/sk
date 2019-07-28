import React from "react";
import { Input, Button, Form, message } from "antd";
import { Formik } from "formik";

import { userDescriptor } from "../../../models/user/descriptor";
import { makeConfirmValidator } from "../../../utils/descriptor";
import { constructSubmitHandler } from "../../form-utils.js";
import { userErrorFields } from "../../../models/user/userErrorMessages";
import { serverErrorFields } from "../../../models/serverErrorMessages";
import { NewFormAntD } from "../../NewFormAntD";

const changePasswordSuccessMessage = "Password changed successfully";

class ChangePassword extends React.Component {
  constructor(props) {
    super(props);
    this.confirmPasswordValidator = makeConfirmValidator(
      "password",
      "confirmPassword",
      props.form,
      "password do not match"
    );
  }

  getSubmitHandler = () => {
    const { form, onSubmit } = this.props;

    return constructSubmitHandler({
      form,
      submitCallback: onSubmit,
      transformErrorMap: [
        {
          field: userErrorFields.userDoesNotExist,
          toField: "email"
        },
        {
          field: serverErrorFields.serverError,
          toField: "error"
        }
      ],
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
      successfulProcess: () => message.success(changePasswordSuccessMessage)
    });
  };

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
              <Form.Item label="Password">
                <Input.Password
                  visibilityToggle
                  autoComplete="new-password"
                  name="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password}
                />
              </Form.Item>
              <Form.Item label="Confirm Password">
                <Input.Password
                  visibilityToggle
                  autoComplete="new-password"
                  name="confirmPassword"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.confirmPassword}
                />
              </Form.Item>
              <Form.Item>
                <Button
                  block
                  type="primary"
                  htmlType="submit"
                  disabled={isSubmitting}
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

export default ChangePassword;
