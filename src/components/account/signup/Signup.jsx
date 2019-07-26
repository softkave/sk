import React from "react";
import { Input, Button, Form } from "antd";

import { userDescriptor } from "../../../models/user/descriptor";
import { makeConfirmValidator } from "../../../utils/descriptor";
import { NewFormAntD } from "../../NewFormAntD";

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
    const { form, onSubmit } = this.props;

    return (
      <NewFormAntD form={form} onSubmit={onSubmit}>
        <Form.Item label="Name">
          {form.getFieldDecorator("name", {
            rules: userDescriptor.name
          })(<Input autoComplete="name" />)}
        </Form.Item>
        <Form.Item label="Email Address">
          {form.getFieldDecorator("email", {
            rules: userDescriptor.email
          })(<Input autoComplete="email" />)}
        </Form.Item>
        <Form.Item label="Confirm Email Address">
          {form.getFieldDecorator("confirmEmail", {
            rules: [
              {
                required: true,
                type: "string",
                validator: this.confirmEmailValidator
              }
            ]
          })(<Input autoComplete="email" />)}
        </Form.Item>
        <Form.Item label="Password" extra={passwordExtraInfo}>
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
            Create Account
          </Button>
        </Form.Item>
      </NewFormAntD>
    );
  }
}

export default Form.create()(Signup);
