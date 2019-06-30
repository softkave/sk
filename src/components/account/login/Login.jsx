import React from "react";
import { Input, Button, Checkbox, Form, Spin } from "antd";

import { userDescriptor } from "../../../models/user/descriptor";
import FormError from "../../FormError.jsx";
import { constructSubmitHandler } from "../../form-utils.js";
import { userErrorFields } from "../../../models/user/userErrorMessages";

class Login extends React.Component {
  constructor(props) {
    super(props);

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
      transformErrorMap: [
        {
          field: userErrorFields.invalidLoginCredentials,
          toField: "error"
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
          <Form.Item label="Password">
            {form.getFieldDecorator("password", {
              rules: userDescriptor.password
            })(
              <Input.Password
                visibilityToggle
                autoComplete="current-password"
              />
            )}
          </Form.Item>
          <Form.Item>
            {form.getFieldDecorator("remember", {
              initialValue: true,
              valuePropName: "checked"
            })(<Checkbox>Remember Me</Checkbox>)}
          </Form.Item>
          <Form.Item>
            <Button block type="primary" htmlType="submit">
              Login
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    );
  }
}

export default Form.create()(Login);
