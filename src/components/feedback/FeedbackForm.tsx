import { Button, Checkbox, Form, Input } from "antd";
import React from "react";
import { blockConstants } from "../../models/block/constants";
import { IUser } from "../../models/user/user";
import FormError from "../forms/FormError";
import { getFormError, IFormikFormErrors } from "../forms/formik-utils";
import {
  formContentWrapperStyle,
  formInputContentWrapperStyle,
} from "../forms/FormStyledComponents";
import useFormHelpers from "../hooks/useFormHelpers";
import { feedbackFormValidationSchema } from "./utils";

export interface IFeedbackFormValues {
  feedback: string;
  description?: string;
  notifyUserOnResolution?: boolean;
  notifyEmail?: string;
}

export type IFeedbackFormErrors = IFormikFormErrors<IFeedbackFormValues>;

export interface IFeedbackFormProps {
  value: IFeedbackFormValues;
  onSubmit: (values: IFeedbackFormValues) => void;
  onClose: () => void;
  user?: IUser;
  isSubmitting?: boolean;
  errors?: IFeedbackFormErrors;
}

const FeedbackForm: React.FC<IFeedbackFormProps> = (props) => {
  const { isSubmitting, value, user, onSubmit, errors: externalErrors } = props;

  const { formik, formikChangedFieldsHelpers } = useFormHelpers({
    errors: externalErrors,
    formikProps: {
      onSubmit,
      initialValues: value,
      validationSchema: feedbackFormValidationSchema,
    },
  });

  const renderFeedbackInput = () => {
    const { touched, values, errors } = formik;

    return (
      <Form.Item
        label="Feedback"
        help={touched.feedback && <FormError error={errors.feedback} />}
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
      >
        <Input.TextArea
          showCount
          autoComplete="off"
          onChange={(evt) => {
            formik.setFieldValue("feedback", evt.target.value);
            formikChangedFieldsHelpers.addField("feedback");
          }}
          value={values.feedback}
          placeholder="Enter your feedback here as concise as possible"
          autoSize={{ minRows: 2, maxRows: 4 }}
          maxLength={blockConstants.maxNameLength}
        />
      </Form.Item>
    );
  };

  const renderDescriptionInput = () => {
    const { touched, errors, values } = formik;

    return (
      <Form.Item
        label="Description"
        help={touched.description && <FormError error={errors.description} />}
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
      >
        <Input.TextArea
          showCount
          autoComplete="off"
          onChange={(evt) => {
            formik.setFieldValue("description", evt.target.value);
            formikChangedFieldsHelpers.addField("description");
          }}
          value={values.description}
          placeholder="You can enter more details here"
          autoSize={{ minRows: 4, maxRows: 8 }}
          maxLength={blockConstants.maxDescriptionLength}
        />
      </Form.Item>
    );
  };

  const renderShouldNotifiyUserInput = () => {
    const { values } = formik;

    if (!user) {
      return null;
    }

    return (
      <Form.Item
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        style={{ width: "100%" }}
        label="Notify Me"
      >
        <Checkbox
          checked={values.notifyUserOnResolution}
          onChange={() => {
            const checked = !values.notifyUserOnResolution;

            formik.setFieldValue("notifyUserOnResolution", checked);
            formikChangedFieldsHelpers.addField("notifyUserOnResolution");

            if (!checked) {
              formik.setFieldValue("notifyEmail", null);
              formikChangedFieldsHelpers.addField("notifyEmail");
            } else if (checked && user) {
              formik.setFieldValue("notifyEmail", user.email);
              formikChangedFieldsHelpers.addField("notifyEmail");
            }
          }}
        >
          Should we notify you when we resolve this feedback?
        </Checkbox>
      </Form.Item>
    );
  };

  const renderUserEmailInput = () => {
    const { touched, errors, values } = formik;

    return (
      <Form.Item
        label="Email Address"
        help={touched.notifyEmail && <FormError error={errors.notifyEmail} />}
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
        extra="Enter the email address you want us to notify you at, when we resolve your feedback."
      >
        <Input
          autoComplete="email"
          onChange={(evt) => {
            formik.setFieldValue("notifyEmail", evt.target.value);
            formikChangedFieldsHelpers.addField("notifyEmail");
          }}
          value={values.notifyEmail}
          placeholder="You email address"
          disabled={!!user && !values.notifyUserOnResolution}
        />
      </Form.Item>
    );
  };

  const getSubmitLabel = () => {
    if (isSubmitting) {
      return "Sending your Feedback";
    } else {
      return "Send Feedback";
    }
  };

  const enableSubmitBtn = () => {
    if (
      formikChangedFieldsHelpers.hasChanges() &&
      !!formik.values.feedback &&
      !formik.errors.feedback
    ) {
      return false;
    }

    return true;
  };

  const renderControls = () => {
    return (
      <div>
        <Button
          block
          type="primary"
          htmlType="submit"
          loading={isSubmitting}
          disabled={enableSubmitBtn()}
        >
          {getSubmitLabel()}
        </Button>
      </div>
    );
  };

  const renderForm = () => {
    const { errors } = formik;
    const globalError = getFormError(errors);

    return (
      <form onSubmit={formik.handleSubmit}>
        <div
          style={{
            ...formContentWrapperStyle,
            padding: 0,
          }}
        >
          <div style={formInputContentWrapperStyle}>
            {globalError && (
              <Form.Item>
                <FormError error={globalError} />
              </Form.Item>
            )}
            {renderFeedbackInput()}
            {renderDescriptionInput()}
            {renderShouldNotifiyUserInput()}
            {renderUserEmailInput()}
          </div>
          {renderControls()}
        </div>
      </form>
    );
  };

  return renderForm();
};

export default React.memo(FeedbackForm);
