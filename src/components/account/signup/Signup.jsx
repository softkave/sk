import React from "react";
import ComputeForm from "../../compute-form/ComputeForm.jsx";
import { Input, Button, Form, Spin } from "antd";
import { userDescriptor } from "../../../models/user/descriptor";
import { makeConfirmValidator } from "../../../utils/descriptor";
import { constructSubmitHandler } from "../../form-utils.js";
import FormError from "../../FormError.jsx";

const passwordExtraInfo = "Minimum of 5 characters";

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.confirmPasswordValidator = makeConfirmValidator(
      "password",
      "confirmPassword",
      props.form,
      "password do not match"
    );

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

    // this.model = {
    //   fields: {
    //     name: {
    //       component: Input,
    //       label: "Name",
    //       props: { autoComplete: "name" },
    //       labelCol: null,
    //       wrapperCol: null,
    //       rules: userDescriptor.name
    //     },
    //     email: {
    //       component: Input,
    //       label: "Email",
    //       props: { autoComplete: "email" },
    //       labelCol: null,
    //       wrapperCol: null,
    //       rules: userDescriptor.email
    //     },
    //     confirmEmail: {
    //       component: Input,
    //       label: "Confirm Email",
    //       props: { autoComplete: "email" },
    //       labelCol: null,
    //       wrapperCol: null,
    //       rules: [
    //         { required: true, type: "string", validator: confirmEmailValidator }
    //       ]
    //     },
    //     password: {
    //       hasFeedback: true,
    //       component: Input,
    //       props: { type: "password", autoComplete: "new-password" },
    //       label: "Password",
    //       labelCol: null,
    //       wrapperCol: null,
    //       rules: [
    //         ...userDescriptor.password,
    //         {
    //           required: true,
    //           type: "string",
    //           validator: confirmPasswordValidator
    //         }
    //       ],
    //       extra: "min of 5 chars"
    //     },
    //     confirmPassword: {
    //       hasFeedback: true,
    //       component: Input,
    //       props: { type: "password", autoComplete: "new-password" },
    //       label: "Confirm Password",
    //       labelCol: null,
    //       wrapperCol: null,
    //       rules: [
    //         ...userDescriptor.password,
    //         {
    //           required: true,
    //           type: "string",
    //           validator: confirmPasswordValidator
    //         }
    //       ]
    //     },
    //     submit: {
    //       component: Button,
    //       props: {
    //         type: "primary",
    //         children: "Signup",
    //         block: true,
    //         htmlType: "submit"
    //       },
    //       labelCol: null,
    //       wrapperCol: null,
    //       noDecorate: true
    //     }
    //   },
    //   formProps: {
    //     hideRequiredMark: true
    //   },
    //   onSubmit: this.onSubmit
    // };
  }

  // onSubmit = async data => {
  //   return this.props.onSubmit(data);
  // };

  // render() {
  //   return <ComputeForm model={this.model} form={this.props.form} />;
  // }

  getSubmitHandler = () => {
    const { form, onSubmit } = this.props;

    return constructSubmitHandler({
      form,
      submitCallback: onSubmit,
      beforeProcess: () => this.setState({ isLoading: true }),
      afterErrorProcess: indexedErrors => {
        if (indexedErrors.error) {
          this.setState({ error: indexedErrors.error });
        }
      },
      completedProcess: () => this.setState({ isLoading: false })
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
          <Form.Item hasFeedback label="Password" extra={passwordExtraInfo}>
            {form.getFieldDecorator("password", {
              rules: userDescriptor.password
            })(<Input.Password visibilityToggle autoComplete="new-password" />)}
          </Form.Item>
          <Form.Item hasFeedback label="Confirm Password">
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
