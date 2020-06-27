import { Button, Form, Input, Typography } from "antd";
import React from "react";
import { IBlock, IBlockLabel, IBlockStatus } from "../../models/block/block";
import { blockErrorMessages } from "../../models/block/blockErrorMessages";
import { blockConstants } from "../../models/block/constants";
import blockValidationSchemas from "../block/validation";
import FormError from "../form/FormError";
import { IFormikFormErrors } from "../form/formik-utils";
import {
  formContentWrapperStyle,
  formInputContentWrapperStyle,
  StyledForm,
} from "../form/FormStyledComponents";
import useFormHelpers from "../hooks/useFormHelpers";
import StyledButton from "../styled/Button";
import StyledContainer from "../styled/Container";
import OrgExistsMessage from "./OrgExistsMessage";

export interface IEditOrgFormValues {
  name: string;
  color: string;
  availableLabels: IBlockLabel[];
  availableStatus: IBlockStatus[];
  description?: string;
}

export type EditOrgFormErrors = IFormikFormErrors<IEditOrgFormValues>;

export interface IEditOrgProps {
  value: IEditOrgFormValues;
  onClose: () => void;
  onSubmit: (values: IEditOrgFormValues) => void;

  isSubmitting?: boolean;
  org?: IBlock;
  formOnly?: boolean;
  errors?: EditOrgFormErrors;
}

const EditOrgForm: React.FC<IEditOrgProps> = (props) => {
  const {
    isSubmitting,
    onClose,
    value,
    onSubmit,
    formOnly,
    org,
    errors: externalErrors,
  } = props;

  const { formik } = useFormHelpers({
    errors: externalErrors,
    formikProps: {
      onSubmit,
      initialValues: value,
      validationSchema: blockValidationSchemas.org,
    },
  });

  // TODO: find a better way to implement this
  // TODO: test your error handling in all forms
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

  const renderNameInput = () => {
    const { touched, values, errors } = formik;
    const orgExistsMessage = doesOrgExist(formik.errors as any);

    // TODO: make your own Editable using Paragraph and Textarea
    return (
      <Form.Item
        required
        label="Name"
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
        {formOnly ? (
          <Input
            autoComplete="off"
            name="name"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={values.name}
            placeholder="Enter organization name"
            disabled={isSubmitting}
            maxLength={blockConstants.maxNameLength}
          />
        ) : (
          <Typography.Paragraph
            editable={{
              onChange: (val) => {
                formik.setFieldValue("name", val);
              },
            }}
          >
            {values.name}
          </Typography.Paragraph>
        )}
      </Form.Item>
    );
  };

  const renderDescriptionInput = () => {
    const { touched, handleBlur, handleChange, values, errors } = formik;

    return (
      <Form.Item
        label="Description"
        help={
          touched.description && <FormError>{errors.description}</FormError>
        }
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
      >
        {formOnly ? (
          <Input.TextArea
            autoSize={{ minRows: 2, maxRows: 6 }}
            autoComplete="off"
            name="description"
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.description}
            placeholder="Enter organization description"
            disabled={isSubmitting}
            maxLength={blockConstants.maxDescriptionLength}
          />
        ) : (
          <Typography.Paragraph
            editable={{
              onChange: (val) => {
                formik.setFieldValue("description", val);
              },
            }}
          >
            {values.description || ""}
          </Typography.Paragraph>
        )}
      </Form.Item>
    );
  };

  const getSubmitLabel = () => {
    if (isSubmitting) {
      if (org) {
        return "Saving Changes";
      } else {
        return "Creating Organization";
      }
    } else {
      if (org) {
        return "Save Changes";
      } else {
        return "Create Organization";
      }
    }
  };

  const renderControls = () => {
    return (
      <StyledContainer>
        <StyledButton
          block
          danger
          type="primary"
          disabled={isSubmitting}
          onClick={onClose}
        >
          Close
        </StyledButton>
        <Button block type="primary" htmlType="submit" loading={isSubmitting}>
          {getSubmitLabel()}
        </Button>
      </StyledContainer>
    );
  };

  const renderForm = () => {
    const { handleSubmit } = formik;
    const errors = (formik.errors as any) as EditOrgFormErrors;

    return (
      <StyledForm onSubmit={handleSubmit}>
        <StyledContainer s={formContentWrapperStyle}>
          <StyledContainer s={formInputContentWrapperStyle}>
            {errors.error && <FormError error={errors.error} />}
            {renderNameInput()}
            {renderDescriptionInput()}
          </StyledContainer>
          {renderControls()}
        </StyledContainer>
      </StyledForm>
    );
  };

  return renderForm();
};

export default React.memo(EditOrgForm);
