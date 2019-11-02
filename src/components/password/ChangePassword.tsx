import { Button, Form, Input, notification } from "antd";
import { Formik } from "formik";
import React from "react";
import * as yup from "yup";
import { userConstants } from "../../models/user/constants";
import { passwordPattern } from "../../models/user/descriptor";
import IOperation, {
  areOperationsSameCheckStatus,
  isOperationCompleted
} from "../../redux/operations/operation";
import cast from "../../utils/cast";
import FormError from "../form/FormError";
import { applyOperationToFormik, getGlobalError } from "../form/formik-utils";

// TODO: Move to a central place ( errorMessages )
const changePasswordSuccessMessage = "Password changed successfully";
const invalidPasswordMessage = "Password is invalid";
const passwordMismatchErrorMessage = "Passwords do not match";

const validationSchema = yup.object().shape({
  password: yup
    .string()
    .min(userConstants.minPasswordLength)
    .max(userConstants.maxPasswordLength)
    .matches(passwordPattern, invalidPasswordMessage)
    .required(),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], passwordMismatchErrorMessage)
    .required()
});

export interface IChangePasswordFormData {
  password: string;
}

interface IChangePasswordFormInternalData extends IChangePasswordFormData {
  confirmPassword: string;
}

export interface IChangePasswordProps {
  onSubmit: (values: IChangePasswordFormData) => void | Promise<void>;
  operation?: IOperation;
}

class ChangePassword extends React.Component<IChangePasswordProps> {
  private formikRef: React.RefObject<
    Formik<IChangePasswordFormInternalData>
  > = React.createRef();

  public componentDidMount() {
    applyOperationToFormik(this.props.operation, this.formikRef);
  }

  public componentDidUpdate(prevProps: IChangePasswordProps) {
    const { operation } = this.props;
    applyOperationToFormik(operation, this.formikRef);

    if (isOperationCompleted(operation)) {
      if (!areOperationsSameCheckStatus(operation, prevProps.operation)) {
        notification.success({
          message: "Change Password",
          description: changePasswordSuccessMessage,
          duration: 0
        });
      }
    }
  }

  public render() {
    const { onSubmit } = this.props;

    return (
      <Formik
        ref={this.formikRef}
        initialValues={cast<IChangePasswordFormInternalData>({})}
        validationSchema={validationSchema}
        onSubmit={async values => {
          onSubmit({
            password: values.password
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
          isSubmitting
        }) => {
          const globalError = getGlobalError(errors);

          return (
            <form onSubmit={handleSubmit}>
              {globalError && (
                <Form.Item>
                  <FormError error={globalError} />
                </Form.Item>
              )}
              <Form.Item
                label="Password"
                help={<FormError>{errors.password}</FormError>}
              >
                <Input.Password
                  visibilityToggle
                  autoComplete="new-password"
                  name="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password}
                />
              </Form.Item>
              <Form.Item
                label="Confirm Password"
                help={<FormError>{errors.confirmPassword}</FormError>}
              >
                <Input.Password
                  visibilityToggle
                  autoComplete="new-password"
                  name="confirmPassword"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.confirmPassword}
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
          );
        }}
      </Formik>
    );
  }
}

export default ChangePassword;
