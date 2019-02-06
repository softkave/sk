import React from "react";
import ComputeForm from "../compute-form/ComputeForm.jsx";
import { Input, Button, Form } from "antd";
import { userDescriptor } from "../../models/user/descriptor";
import { makeConfirmValidator } from "../../utils/descriptor";

class ChangePassword extends React.Component {
  constructor(props) {
    super(props);
    const confirmPasswordValidator = makeConfirmValidator(
      "password",
      "confirmPassword",
      props.form,
      "password do not match"
    );

    this.model = {
      fields: {
        password: {
          component: Input.Password,
          props: { type: "password" },
          label: "Password",
          labelCol: null,
          wrapperCol: null,
          rules: [
            ...userDescriptor.password,
            { validator: confirmPasswordValidator }
          ]
        },
        confirmPassword: {
          component: Input.Password,
          props: { type: "password" },
          label: "Confirm Password",
          labelCol: null,
          wrapperCol: null,
          rules: [
            ...userDescriptor.password,
            { validator: confirmPasswordValidator }
          ]
        },
        submit: {
          component: Button,
          props: {
            type: "primary",
            children: "Submit",
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
  }

  onSubmit = async (data, form) => {};

  render() {
    return <ComputeForm model={this.model} form={this.props.form} />;
  }
}

export default Form.create()(ChangePassword);
