import { Button, Form, Input } from "antd";
import { Formik, FormikProps } from "formik";
import React from "react";
import { IBlockLabel, IBlockStatus } from "../../models/block/block";
import { blockErrorMessages } from "../../models/block/blockErrorMessages";
import blockValidationSchemas from "../block/validation";
import FormError from "../form/FormError";
import { IFormikFormErrors } from "../form/formik-utils";
import {
  FormBody,
  FormBodyContainer,
  FormControls,
  StyledForm,
} from "../form/FormStyledComponents";
import StyledButton from "../styled/Button";
import OrgExistsMessage from "./OrgExistsMessage";

export interface IEditOrgFormValues {
  name: string;
  availableLabels: IBlockLabel[];
  availableStatus: IBlockStatus[];
  description?: string;
}

type EditOrgFormFormikProps = FormikProps<IEditOrgFormValues>;
export type EditOrgFormErrors = IFormikFormErrors<IEditOrgFormValues>;

export interface IEditOrgProps {
  value: IEditOrgFormValues;
  onClose: () => void;
  onSubmit: (values: IEditOrgFormValues) => void;

  submitLabel?: React.ReactNode;
  isSubmitting?: boolean;
  errors?: EditOrgFormErrors;
}

// TODO: Move all stray strings to a central location
const defaultSubmitLabel = "Create Organization";

const EditOrgForm: React.FC<IEditOrgProps> = (props) => {
  const {
    isSubmitting,
    onClose,
    submitLabel,
    value,
    onSubmit,
    errors: externalErrors,
  } = props;

  const doesOrgExist = (
    errorMessages: IFormikFormErrors<IEditOrgFormValues>
  ) => {
    if (errorMessages) {
      let messages: string[] = [];

      if (errorMessages.error) {
        messages = messages.concat(errorMessages.error);
      }

      if (errorMessages.name) {
        messages = messages.concat(errorMessages.name);
      }

      return messages.find((message) => {
        return message === blockErrorMessages.orgExists;
      });
    }
  };

  const renderNameInput = (formikProps: EditOrgFormFormikProps) => {
    const { touched, handleBlur, handleChange, values, errors } = formikProps;
    const orgExistsMessage = doesOrgExist(formikProps.errors as any);

    return (
      <Form.Item
        label="Organization Name"
        help={
          touched.name &&
          (!!orgExistsMessage ? (
            <OrgExistsMessage message={orgExistsMessage} />
          ) : (
            <FormError error={errors.name} />
          ))
        }
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
      >
        <Input
          autoComplete="off"
          name="name"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.name}
          placeholder="Organization name"
        />
      </Form.Item>
    );
  };

  const renderDescriptionInput = (formikProps: EditOrgFormFormikProps) => {
    const { touched, handleBlur, handleChange, values, errors } = formikProps;

    return (
      <Form.Item
        label="Description"
        help={
          touched.description && <FormError>{errors.description}</FormError>
        }
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
      >
        <Input.TextArea
          autoSize={{ minRows: 2, maxRows: 6 }}
          autoComplete="off"
          name="description"
          onBlur={handleBlur}
          onChange={handleChange}
          value={values.description}
          placeholder="Organization description"
        />
      </Form.Item>
    );
  };

  const renderControls = () => {
    return (
      <FormControls>
        <StyledButton
          block
          danger
          type="primary"
          disabled={isSubmitting}
          onClick={onClose}
        >
          Cancel
        </StyledButton>
        <Button block type="primary" htmlType="submit" loading={isSubmitting}>
          {submitLabel || defaultSubmitLabel}
        </Button>
      </FormControls>
    );
  };

  const renderForm = (formikProps: EditOrgFormFormikProps) => {
    const { handleSubmit } = formikProps;
    const errors = (formikProps.errors as any) as EditOrgFormErrors;

    return (
      <StyledForm onSubmit={handleSubmit}>
        <FormBodyContainer>
          <FormBody>
            {errors.error && <FormError error={errors.error} />}
            {renderNameInput(formikProps)}
            {renderDescriptionInput(formikProps)}
          </FormBody>
          {renderControls()}
        </FormBodyContainer>
      </StyledForm>
    );
  };

  return (
    <Formik
      // @ts-ignore
      initialErrors={externalErrors}
      initialValues={value}
      validationSchema={blockValidationSchemas.org}
      onSubmit={onSubmit}
    >
      {(formikProps) => renderForm(formikProps)}
    </Formik>
  );
};

export default React.memo(EditOrgForm);
