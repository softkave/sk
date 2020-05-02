import { Button, Form, Input, notification } from "antd";
import { Formik } from "formik";
import React from "react";
import * as yup from "yup";
import IOperation, {
  areOperationsSameCheckStatus,
  isOperationCompleted,
} from "../../redux/operations/operation";
import cast from "../../utils/cast";
import FormError from "../form/FormError";
import { applyOperationToFormik, getGlobalError } from "../form/formik-utils";
import { FormBody } from "../form/FormStyledComponents";

const emailMismatchErrorMessage = "Email does not match";
const successMessage = `
  Request was successful,
  a change password link will been sent to your email address.`;

const validationSchema = yup.object().shape({
  email: yup.string().email().required(),
  confirmEmail: yup
    .string()
    .oneOf([yup.ref("email")], emailMismatchErrorMessage)
    .required(),
});

export interface IForgotPasswordFormData {
  email: string;
}

interface IForgotPasswordFormInternalData extends IForgotPasswordFormData {
  confirmEmail: string;
}

export interface IForgotPasswordProps {
  onSubmit: (values: IForgotPasswordFormData) => void | Promise<void>;
  operation?: IOperation;
}

class ForgotPassword extends React.Component<IForgotPasswordProps> {
  private formikRef: React.RefObject<any> = React.createRef();

  public componentDidMount() {
    applyOperationToFormik(this.props.operation, this.formikRef);
  }

  public componentDidUpdate(prevProps: IForgotPasswordProps) {
    const { operation } = this.props;
    applyOperationToFormik(operation, this.formikRef);

    if (isOperationCompleted(operation)) {
      if (!areOperationsSameCheckStatus(operation, prevProps.operation)) {
        notification.success({
          message: "Forgot Password",
          description: successMessage,
          duration: 0,
        });
      }
    }
  }

  public render() {
    const { onSubmit } = this.props;

    return (
      <Formik
        // TODO: fix error
        // @ts-ignore
        ref={this.formikRef}
        initialValues={cast<IForgotPasswordFormInternalData>({})}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          onSubmit({
            email: values.email,
          });
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => {
          const globalError = getGlobalError(errors);

          return (
            <FormBody>
              <form onSubmit={handleSubmit}>
                {globalError && (
                  <Form.Item>
                    <FormError error={globalError} />
                  </Form.Item>
                )}
                <Form.Item
                  label="Email Address"
                  help={touched.email && <FormError>{errors.email}</FormError>}
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                >
                  <Input
                    autoComplete="email"
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.email}
                  />
                </Form.Item>
                <Form.Item
                  label="Confirm Email Address"
                  help={
                    touched.confirmEmail && (
                      <FormError>{errors.confirmEmail}</FormError>
                    )
                  }
                  labelCol={{ span: 24 }}
                  wrapperCol={{ span: 24 }}
                >
                  <Input
                    autoComplete="email"
                    name="confirmEmail"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.confirmEmail}
                  />
                </Form.Item>
                <Form.Item>
                  <Button
                    block
                    type="primary"
                    htmlType="submit"
                    loading={isSubmitting}
                  >
                    Change Password
                  </Button>
                </Form.Item>
              </form>
            </FormBody>
          );
        }}
      </Formik>
    );
  }
}

export default ForgotPassword;
