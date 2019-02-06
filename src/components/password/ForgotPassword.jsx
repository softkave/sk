import React from "react";
import ComputeForm from "../compute-form/ComputeForm.jsx";
import { Input, Button, Form } from "antd";
import { userDescriptor } from "../../models/user/descriptor";
import { makeConfirmValidator } from "../../utils/descriptor";

class ForgotPassword extends React.Component {
  constructor(props) {
    super(props);
    const confirmEmailValidator = makeConfirmValidator(
      "email",
      "confirmEmail",
      props.form,
      "email does not match"
    );

    this.model = {
      fields: {
        email: {
          component: Input.Password,
          label: "Email",
          labelCol: null,
          wrapperCol: null,
          rules: [...userDescriptor.email, { validator: confirmEmailValidator }]
        },
        confirmEmail: {
          component: Input,
          label: "Confirm Email",
          labelCol: null,
          wrapperCol: null,
          rules: [...userDescriptor.email, { validator: confirmEmailValidator }]
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

export default Form.create()(ForgotPassword);
