import React from "react";
import { Input, Button, Form, Spin } from "antd";

import { userDescriptor } from "../../../models/user/descriptor";
import { makeConfirmValidator } from "../../../utils/descriptor";
import { constructSubmitHandler } from "../../form-utils.js";
import FormError from "../../FormError.jsx";
import { userErrorFields } from "../../../models/user/userErrorMessages";
import { serverErrorFields } from "../../../models/serverErrorMessages";
import { makeSubmitHandler, aggregateError } from "../../FOR";

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

    this.state = {
      isLoading: false,
      error: null
    };
  }

  setFormError(error) {
    this.setState({ error, isLoading: false });
  }

  getSubmitHandler = () => {
    const { form, onSubmit } = this.props;
    const self = this;

    return makeSubmitHandler({
      submit: onSubmit,
      before() {
        this.setState({ isLoading: true, error: null });
      },

      onError(error) {
        const reduced = aggregateError(error, form.getFieldsValue());

        if (Object.keys(reduced.values)) {
          form.setFields(reduced.values);
        }

        if (reduced.global.length > 0) {
          self.setState({
            error: reduced.global.join(", "),
            isLoading: false
          });
        }
      },

      success() {},

      done() {}
    });

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
          field: userErrorFields.emailAddressNotAvailable,
          toField: "email"
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
    const { isLoading, error } = this.state;
    const onSubmit = this.getSubmitHandler();

    return (
      <Spin spinning={isLoading}>
        <Form onSubmit={onSubmit}>
          {error && <FormError>{error}</FormError>}
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
        </Form>
      </Spin>
    );
  }
}

export default Form.create()(Signup);
