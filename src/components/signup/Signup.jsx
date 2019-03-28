import React from "react";
import ComputeForm from "../compute-form/ComputeForm.jsx";
import { Input, Button, Form } from "antd";
import { userDescriptor } from "../../models/user/descriptor";
import { makeConfirmValidator } from "../../utils/descriptor";

class Signup extends React.Component {
  constructor(props) {
    super(props);
    const confirmPasswordValidator = makeConfirmValidator(
      "password",
      "confirmPassword",
      props.form,
      "password do not match"
    );

    const confirmEmailValidator = makeConfirmValidator(
      "email",
      "confirmEmail",
      props.form,
      "email does not match"
    );

    this.model = {
      fields: {
        name: {
          component: Input,
          label: "Name",
          props: { autoComplete: "name" },
          labelCol: null,
          wrapperCol: null,
          rules: userDescriptor.name
        },
        email: {
          component: Input,
          label: "Email",
          props: { autoComplete: "email" },
          labelCol: null,
          wrapperCol: null,
          rules: userDescriptor.email
        },
        confirmEmail: {
          component: Input,
          label: "Confirm Email",
          props: { autoComplete: "email" },
          labelCol: null,
          wrapperCol: null,
          rules: [
            { required: true, type: "string", validator: confirmEmailValidator }
          ]
        },
        password: {
          hasFeedback: true,
          component: Input,
          props: { type: "password", autoComplete: "new-password" },
          label: "Password",
          labelCol: null,
          wrapperCol: null,
          rules: [
            ...userDescriptor.password,
            {
              required: true,
              type: "string",
              validator: confirmPasswordValidator
            }
          ],
          extra: "min of 5 chars including an alphabet, a number, and a symbol"
        },
        confirmPassword: {
          hasFeedback: true,
          component: Input,
          props: { type: "password", autoComplete: "new-password" },
          label: "Confirm Password",
          labelCol: null,
          wrapperCol: null,
          rules: [
            {
              required: true,
              type: "string",
              validator: confirmPasswordValidator
            }
          ]
        },
        submit: {
          component: Button,
          props: {
            type: "primary",
            children: "Signup",
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

  onSubmit = async data => {
    return this.props.onSubmit(data);
  };

  render() {
    return <ComputeForm model={this.model} form={this.props.form} />;
  }
}

export default Form.create()(Signup);
