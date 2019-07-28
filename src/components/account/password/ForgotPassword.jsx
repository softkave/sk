import React from "react";
import { Input, Button, Form, notification } from "antd";
import { Formik } from "formik";

import { userDescriptor } from "../../../models/user/descriptor";
import { makeConfirmValidator } from "../../../utils/descriptor";
import { constructSubmitHandler } from "../../form-utils.js";
import { userErrorFields } from "../../../models/user/userErrorMessages";
import { serverErrorFields } from "../../../models/serverErrorMessages";
import { NewFormAntD } from "../../NewFormAntD";

const successMessage = `
  Request was successful,
  a change password link will been sent to your email address.`;

class ForgotPassword extends React.Component {
  constructor(props) {
    super(props);
    this.confirmEmailValidator = makeConfirmValidator(
      "email",
      "confirmEmail",
      props.form,
      "email does not match"
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
      successfulProcess: () => {
        // message.success(successMessage, messageDuration)
        // clearForm(this.props.form);
        notification.success({
          message: "Forgot Password",
          description: successMessage,
          duration: 0
        });
      },
      completedProcess: () => {
        this.setState({ isLoading: false });
      }
    });
  };

  render() {
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
                )}
              </Form.Item>
              <Form.Item label="Confirm Email Address">
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

export default ForgotPassword;
