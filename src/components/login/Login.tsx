import { Button, Checkbox, Form, Input, Typography } from "antd";
import { memoize } from "lodash";
import React from "react";
import * as yup from "yup";
import { userConstants } from "../../models/user/constants";
import FormError from "../forms/FormError";
import { getFormError, IFormikFormErrors } from "../forms/formik-utils";
import { formClassname } from "../forms/FormStyledComponents";
import useFormHelpers from "../hooks/useFormHelpers";

const validationSchema = yup.object().shape({
  email: yup.string().trim().email().required(),
  password: yup.string().trim().max(userConstants.maxPasswordLength).required(),
});

export interface ILoginFormValues {
  email: string;
  password: string;
  remember: boolean;
}

const getInitialValues = memoize(
  (): ILoginFormValues => {
    return {
      email: "",
      password: "",
      remember: false,
    };
  },
  () => "login"
);

export interface ILoginProps {
  onSubmit: (values: ILoginFormValues) => void | Promise<void>;
  isSubmitting?: boolean;
  errors?: IFormikFormErrors<ILoginFormValues>;
}

const Login: React.FC<ILoginProps> = (props) => {
  const { onSubmit, isSubmitting, errors: externalErrors } = props;
  const { formik } = useFormHelpers({
    errors: externalErrors,
    formikProps: {
      onSubmit,
      validationSchema,
      initialValues: getInitialValues(),
    },
  });

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } =
    formik;

  const globalError = getFormError(errors);
  return (
    <form onSubmit={handleSubmit} className={formClassname}>
      <Form.Item>
        <Typography.Title level={5}>Login</Typography.Title>
      </Form.Item>
      {globalError && (
        <Form.Item>
          <FormError error={globalError} />
        </Form.Item>
      )}
      <Form.Item
        required
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
          disabled={isSubmitting}
          placeholder="Enter your email address"
        />
      </Form.Item>
      <Form.Item
        required
        label="Password"
        help={touched.password && <FormError>{errors.password}</FormError>}
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
      >
        <Input.Password
          visibilityToggle
          autoComplete="current-password"
          name="password"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.password}
          disabled={isSubmitting}
          placeholder="Enter your password"
          maxLength={userConstants.maxPasswordLength}
        />
      </Form.Item>
      <Form.Item>
        <Checkbox
          name="remember"
          onChange={handleChange}
          checked={values.remember}
          disabled={isSubmitting}
        >
          Remember Me
        </Checkbox>
      </Form.Item>
      <Form.Item>
        <Button block type="primary" htmlType="submit" loading={isSubmitting}>
          {isSubmitting ? "Logging In" : "Login"}
        </Button>
      </Form.Item>
    </form>
  );
};

export default React.memo(Login);
