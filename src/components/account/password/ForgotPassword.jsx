import React from "react";
import { Input, Button, Form, message, Spin } from "antd";

import { userDescriptor } from "../../../models/user/descriptor";
import { makeConfirmValidator } from "../../../utils/descriptor";
import appInfo from "../../../info/app-info";
import { constructSubmitHandler } from "../../form-utils.js";
import FormError from "../../FormError.jsx";
import { userErrorFields } from "../../../models/user/userErrorMessages";

const forgotPasswordRequestSuccessMessage = `
  Request successful, if you have an account with ${appInfo.appName}, 
  a change password link will been sent to your email address`;

class ForgotPassword extends React.Component {
  constructor(props) {
    super(props);
    this.confirmEmailValidator = makeConfirmValidator(
      "email",
      "confirmEmail",
      props.form,
      "email does not match"
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
      successfulProcess: () =>
        message.success(forgotPasswordRequestSuccessMessage),
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
          <Form.Item>
            <Button block type="primary" htmlType="submit">
              Send Request
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    );
  }
}

export default Form.create()(ForgotPassword);
