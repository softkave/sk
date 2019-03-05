import React from "react";
import ComputeForm from "../compute-form/ComputeForm.jsx";
import { Input, Button, Checkbox, Form } from "antd";
import { userDescriptor } from "../../models/user/descriptor";
import { connect } from "react-redux";
import { mergeDataByPath } from "../../redux/actions/data";
import netInterface from "../../net";
import { applyErrors } from "../compute-form/utils";

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

  onSubmit = async (data, form) => {
    try {
      let result = await netInterface("user.login", data);
      console.log(result);
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
    onSignup: data => {
      if (data.remember) {
        localStorage.setItem("user", JSON.stringify(data));
      }

      dispatch(mergeDataByPath("user", data));
    }
  };
}

export default connect(
  null,
  mapDispatchToProps
)(Form.create()(Login));
