import React from "react";
import { Input, Button, Form, message } from "antd";

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
    const { form } = this.props;

    return (
      <NewFormAntD>
        <Form.Item label="Password">
          {form.getFieldDecorator("password", {
            rules: userDescriptor.password
          })(<Input.Password visibilityToggle autoComplete="new-password" />)}
        </Form.Item>
        <Form.Item label="Confirm Password">
          {form.getFieldDecorator("confirmPassword", {
            rules: [
              {
                required: true,
                type: "string",
                validator: this.confirmPasswordValidator
              }
            ]
          })(<Input.Password visibilityToggle autoComplete="new-password" />)}
        </Form.Item>
        <Form.Item>
          <Button block type="primary" htmlType="submit">
            Change Password
          </Button>
        </Form.Item>
      </NewFormAntD>
    );
  }
}

export default Form.create()(ChangePassword);
