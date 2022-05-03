import { Button, Form } from "antd";
import React from "react";
import { ArrowLeft } from "react-feather";
import { messages } from "../../models/messages";
import { IAppOrganization } from "../../models/organization/types";
import blockValidationSchemas from "../block/validation";
import ColorPicker from "../forms/ColorPicker";
import FormError from "../forms/FormError";
import { IFormikFormErrors } from "../forms/formik-utils";
import {
  formClassname,
  formContentWrapperStyle,
} from "../forms/FormStyledComponents";
import useFormHelpers from "../hooks/useFormHelpers";
import InputWithControls from "../utilities/InputWithControls";
import OrganizationExistsMessage from "./OrganizationExistsMessage";

export interface IOrganizationFormValues {
  name: string;
  color: string;
  description?: string;
}

export type OrganizationFormErrors = IFormikFormErrors<IOrganizationFormValues>;

export interface IOrganizationFormProps {
  value: IOrganizationFormValues;
  onClose: () => void;
  onSubmit: (values: IOrganizationFormValues) => void;

  isSubmitting?: boolean;
  org?: IAppOrganization;
  errors?: OrganizationFormErrors;
}

const OrganizationForm: React.FC<IOrganizationFormProps> = (props) => {
  const {
    isSubmitting,
    onClose,
    value,
    onSubmit,
    org,
    errors: externalErrors,
  } = props;

  const { formik, formikHelpers, formikChangedFieldsHelpers } = useFormHelpers({
    errors: externalErrors,
    formikProps: {
      onSubmit,
      initialValues: value,
      validationSchema: blockValidationSchemas.org,
    },
  });

  // TODO: find a better way to implement this
  // TODO: test your error handling in all forms
  const checkOrganizationExist = (
    errorMessages: IFormikFormErrors<IOrganizationFormValues>
  ) => {
    if (errorMessages) {
      let funcErrors: string[] = [];

      if (errorMessages.error) {
        funcErrors = funcErrors.concat(errorMessages.error);
      } else if (errorMessages.name) {
        funcErrors = funcErrors.concat(errorMessages.name);
      }

      return funcErrors.find((message) => {
        return message === messages.organizationExists;
      });
    }
  };

  const orgExistsMessage = checkOrganizationExist(formik.errors as any);
  const nameNode = (
    <Form.Item
      label="Organization Name"
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
      help={
        formik.touched.name &&
        (!!orgExistsMessage ? (
          <OrganizationExistsMessage message={orgExistsMessage} />
        ) : (
          <FormError error={formik.errors.name} />
        ))
      }
      style={{ width: "100%" }}
    >
      <InputWithControls
        value={formik.values.name}
        onChange={(val) => {
          formik.setFieldValue("name", val);
          formikChangedFieldsHelpers.addField("name");
        }}
        revertChanges={() => {
          formikHelpers.revertChanges("name");
        }}
        autoComplete="off"
        disabled={isSubmitting}
        inputOnly={!org}
        placeholder="Organization name"
      />
    </Form.Item>
  );

  const colorNode = (
    <Form.Item
      label="Color Avatar"
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
      style={{ width: "100%" }}
    >
      <ColorPicker
        value={value.color}
        disabled={isSubmitting}
        onChange={(val) => {
          formik.setFieldValue("color", val);
          formikChangedFieldsHelpers.addField("color");
        }}
      />
    </Form.Item>
  );

  const descriptionNode = (
    <Form.Item
      label="Description"
      labelCol={{ span: 24 }}
      wrapperCol={{ span: 24 }}
      help={
        formik.touched.description && (
          <FormError>{formik.errors.description}</FormError>
        )
      }
    >
      <InputWithControls
        useTextArea
        value={formik.values.description}
        onChange={(val) => {
          formik.setFieldValue("description", val);
          formikChangedFieldsHelpers.addField("description");
        }}
        revertChanges={() => {
          formikHelpers.revertChanges("description");
        }}
        autoComplete="off"
        disabled={isSubmitting}
        inputOnly={!org}
        placeholder="Description"
      />
    </Form.Item>
  );

  const submitLabel = isSubmitting
    ? org
      ? "Saving Changes"
      : "Creating Organization"
    : org
    ? "Save Changes"
    : "Create Organization";

  const controlsNode = (
    <div>
      <Button
        block
        type="primary"
        htmlType="submit"
        loading={isSubmitting}
        disabled={!formikChangedFieldsHelpers.hasChanges()}
      >
        {submitLabel}
      </Button>
    </div>
  );

  const { handleSubmit } = formik;
  const errors = formik.errors as any as OrganizationFormErrors;

  return (
    <form onSubmit={handleSubmit} className={formClassname}>
      <div style={formContentWrapperStyle}>
        <div style={{ paddingBottom: "16px" }}>
          <Button
            style={{ cursor: "pointer" }}
            onClick={onClose}
            className="icon-btn"
          >
            <ArrowLeft />
          </Button>
        </div>
        {errors.error && <FormError error={errors.error} />}
        {nameNode}
        {descriptionNode}
        {colorNode}
        {controlsNode}
      </div>
    </form>
  );
};

export default React.memo(OrganizationForm);
