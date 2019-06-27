import React from "react";
import { Input, Button, Form, message, Spin } from "antd";
import ComputeForm from "../../compute-form/ComputeForm.jsx";
import { userDescriptor } from "../../../models/user/descriptor";
import { makeConfirmValidator } from "../../../utils/descriptor";
import appInfo from "../../../info/app-info";

const forgotPasswordRequestSuccessMessage = `
  Request successful, if you have an account with ${appInfo.appName}, 
  a change password link will been sent to your email address`;

class ForgotPassword extends React.Component {
  constructor(props) {
    super(props);
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
    //     email: {
    //       component: Input,
    //       label: "Email",
    //       labelCol: null,
    //       wrapperCol: null,
    //       rules: [...userDescriptor.email, { validator: confirmEmailValidator }]
    //     },
    //     confirmEmail: {
    //       component: Input,
    //       label: "Confirm Email",
    //       labelCol: null,
    //       wrapperCol: null,
    //       rules: [...userDescriptor.email, { validator: confirmEmailValidator }]
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
  //   message.success("request successful");
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
      successfulProcess: () =>
        message.success(forgotPasswordRequestSuccessMessage),
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
          <Form.Item>
            <Button block type="primary" htmlType="submit">
              Send Request
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    );
  }
}

export default Form.create()(ForgotPassword);
