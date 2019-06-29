import React from "react";
import ComputeForm from "../../compute-form/ComputeForm.jsx";
import { Input, Button, Checkbox, Form, Spin } from "antd";
import { userDescriptor } from "../../../models/user/descriptor";
import FormError from "../../FormError.jsx";
import { constructSubmitHandler } from "../../form-utils.js";

class Login extends React.Component {
  constructor(props) {
    super(props);
    // const self = this;
    // this.model = {
    //   fields: {
    //     email: {
    //       component: Input,
    //       props: { autoComplete: "email" },
    //       label: "Email",
    //       labelCol: null,
    //       wrapperCol: null,
    //       rules: userDescriptor.email
    //     },
    //     password: {
    //       component: Input,
    //       props: { type: "password", autoComplete: "current-password" },
    //       label: "Password",
    //       labelCol: null,
    //       wrapperCol: null,
    //       rules: userDescriptor.password
    //     },
    //     remember: {
    //       component: Checkbox,
    //       valuePropName: "checked",
    //       props: { children: "Remember me" },
    //       initialValue: true
    //     },
    //     submit: {
    //       component: Button,
    //       props: {
    //         type: "primary",
    //         children: "Login",
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
    //   onSubmit: self.onSubmit
    // };

    this.state = {
      isLoading: false,
      error: null
    };
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
      beforeProcess: () => this.setState({ isLoading: true, error: null }),
      afterErrorProcess: indexedErrors => {
        if (Array.isArray(indexedErrors.error)) {
          this.setState({ error: indexedErrors.error[0].message });
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
