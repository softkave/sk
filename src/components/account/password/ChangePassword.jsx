import React from "react";
import ComputeForm from "../../compute-form/ComputeForm.jsx";
import { Input, Button, Form, message, Spin } from "antd";
import { userDescriptor } from "../../../models/user/descriptor";
import { makeConfirmValidator } from "../../../utils/descriptor";
import { constructSubmitHandler } from "../../form-utils.js";
import FormError from "../../FormError.jsx";

const changePasswordSuccessMessage = "Password changed successfully";

class ChangePassword extends React.Component {
  constructor(props) {
    super(props);
    this.confirmPasswordValidator = makeConfirmValidator(
      "password",
      "confirmPassword",
      props.form,
      "password do not match"
    );

    this.state = {
      isLoading: false,
      error: null
    };

    // this.model = {
    //   fields: {
    //     password: {
    //       component: Input.Password,
    //       props: { type: "password" },
    //       label: "Password",
    //       labelCol: null,
    //       wrapperCol: null,
    //       rules: [
    //         ...userDescriptor.password,
    //         { validator: confirmPasswordValidator }
    //       ]
    //     },
    //     confirmPassword: {
    //       component: Input.Password,
    //       props: { type: "password" },
    //       label: "Confirm Password",
    //       labelCol: null,
    //       wrapperCol: null,
    //       rules: [
    //         ...userDescriptor.password,
    //         { validator: confirmPasswordValidator }
    //       ]
    //     },
    //     submit: {
    //       component: Button,
    //       props: {
    //         type: "primary",
    //         children: "Submit",
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
  //   await this.props.onSubmit(data);
  //   message.success("change password succeeded");
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
      successfulProcess: () => message.success(changePasswordSuccessMessage),
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
          <Form.Item label="Password">
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
              Change Password
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    );
  }
}

export default Form.create()(ChangePassword);
