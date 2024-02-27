import { Button, Checkbox, Form } from "antd";
import React from "react";
import { IClient } from "../../models/user/types";
import { getFormError, IFormikFormErrors } from "../forms/formik-utils";
import useFormHelpers from "../hooks/useFormHelpers";
import FormFieldError from "../utils/form/FormFieldError";
import { formClasses, formSectionClassname } from "../utils/form/styles";

export interface IUpdateClientFormData {
  muteChatNotifications: boolean;
}

export interface IUpdateClientFormProps {
  client: IClient;
  onSubmit: (values: IUpdateClientFormData) => void | Promise<void>;
  errors?: IFormikFormErrors<IUpdateClientFormData>;
  isSubmitting?: boolean;
}

const UpdateClientForm: React.FC<IUpdateClientFormProps> = (props) => {
  const { client, onSubmit, isSubmitting, errors: externalErrors } = props;
  const { formik } = useFormHelpers({
    errors: externalErrors,
    formikProps: {
      initialValues: {
        muteChatNotifications: client.muteChatNotifications,
      } as IUpdateClientFormData,
      onSubmit: (data) => {
        onSubmit({
          muteChatNotifications: data.muteChatNotifications,
        });
      },
    },
  });

  const globalError = getFormError(formik.errors);
  const muteChatNotificationsNode = (
    <Form.Item
      help={
        formik.touched?.muteChatNotifications &&
        formik.errors?.muteChatNotifications && (
          <FormFieldError error={formik.errors.muteChatNotifications} />
        )
      }
    >
      <Checkbox
        checked={formik.values.muteChatNotifications}
        onChange={(evt) => {
          formik.setFieldValue("muteChatNotifications", evt.target.checked);
        }}
      >
        Mute chat notifications for this browser
      </Checkbox>
    </Form.Item>
  );

  return (
    <form
      onSubmit={formik.handleSubmit}
      className={formClasses.form}
      style={{ height: "auto", width: "auto" }}
    >
      <div className={formClasses.formContent}>
        {globalError && (
          <Form.Item>
            <FormFieldError error={globalError} />
          </Form.Item>
        )}
        <div className={formSectionClassname}>{muteChatNotificationsNode}</div>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isSubmitting}>
            {isSubmitting ? "Updating Settings" : "Update Settings"}
          </Button>
        </Form.Item>
      </div>
    </form>
  );
};

export default UpdateClientForm;
