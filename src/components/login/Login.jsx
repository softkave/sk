import React from "react";
import ComputeForm from "../compute-form/ComputeForm.jsx";
import { Input, Button, Checkbox, Form } from "antd";
import { userDescriptor } from "../../models/user/descriptor";

class Login extends React.Component {
  model = {
    fields: {
      email: {
        component: Input,
        props: { autocomplete: "email" },
        label: "Email",
        labelCol: null,
        wrapperCol: null,
        rules: userDescriptor.email
      },
      password: {
        component: Input,
        props: { type: "password", autocomplete: "current-password" },
        label: "Password",
        labelCol: null,
        wrapperCol: null,
        rules: userDescriptor.password
      },
      remember: {
        component: Checkbox,
        valuePropName: "checked",
        props: { children: "Remember me" },
        initialValue: true
      },
      submit: {
        component: Button,
        props: {
          type: "primary",
          children: "Login",
          block: true,
          htmlType: "submit"
        },
        labelCol: null,
        wrapperCol: null,
        noDecorate: true
      }
    },
    formProps: {
      hideRequiredMark: true
    },
    onSubmit: this.onSubmit
  };

  onSubmit = async data => {
    return this.props.onSignup(data);
  };

  render() {
    return <ComputeForm model={this.model} form={this.props.form} />;
  }
}

export default Form.create()(Login);
