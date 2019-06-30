import React from "react";
import { Input, Button, Form, message, Spin } from "antd";

import { userDescriptor } from "../../../models/user/descriptor";
import { makeConfirmValidator } from "../../../utils/descriptor";
import { constructSubmitHandler } from "../../form-utils.js";
import FormError from "../../FormError.jsx";
import { userErrorFields } from "../../../models/user/userErrorMessages";

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

    this.state = {
      isLoading: false,
      error: null
    };
  }

  getSubmitHandler = () => {
    const { form, onSubmit } = this.props;

    return constructSubmitHandler({
      form,
      submitCallback: onSubmit,
      beforeProcess: () => this.setState({ isLoading: true, error: null }),
      afterErrorProcess: indexedErrors => {
        if (Array.isArray(indexedErrors.error)) {
          this.setState({
            error: indexedErrors.error[0].message,
            loading: false
          });
        }
      },
      successfulProcess: () => message.success(changePasswordSuccessMessage),
      transformErrorMap: [
        {
          field: userErrorFields.userDoesNotExist,
          toField: "email"
        }
      ]
    });
  };

  render() {
    const { form } = this.props;
    const { isLoading, error } = this.state;
    const onSubmit = this.getSubmitHandler();

    return (
      <Spin spinning={isLoading}>
        <Form hideRequiredMark onSubmit={onSubmit}>
          {error && <FormError>{error}</FormError>}
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
        </Form>
      </Spin>
    );
  }
}

export default Form.create()(ChangePassword);
