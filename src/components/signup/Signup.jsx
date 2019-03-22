import React from "react";
import ComputeForm from "../compute-form/ComputeForm.jsx";
import { Input, Button, Form } from "antd";
import { userDescriptor } from "../../models/user/descriptor";
import { makeConfirmValidator } from "../../utils/descriptor";
import netInterface from "../../net";
import { applyErrors } from "../compute-form/utils";
import { mergeDataByPath } from "../../redux/actions/data";
import { connect } from "react-redux";

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
          rules: [...userDescriptor.password],
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

  onSubmit = async (data, form) => {
    try {
      console.log(data);
      let result = await netInterface("user.signup", data);
      console.log(result);
      //console.log(result);
      this.props.onSignup(result);
    } catch (error) {
      console.log(error);
      applyErrors(error, form);
    }
  };

  render() {
    return <ComputeForm model={this.model} form={this.props.form} />;
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onSignup: async data => {
      // let user = await netInterface("user.signup", data);
      dispatch(mergeDataByPath("user", data));
    }
  };
}

export default connect(
  null,
  mapDispatchToProps
)(Form.create()(Signup));
