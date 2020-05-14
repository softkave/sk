import { Button, Form, Input, Typography } from "antd";
import { Formik, FormikProps } from "formik";
// import debounce from "lodash/debounce";
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
import useInsertFormikErrors from "../hooks/useInsertFormikErrors";
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

type EditOrgFormFormikProps = FormikProps<IEditOrgFormValues>;
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

  console.log({ props });

  // const [fieldsEditing, setFieldsEditing] = React.useState<string[]>(() => {
  //   const initialFieldsEditing: string[] = [];

  //   if ((value.name || "").length === 0) {
  //     initialFieldsEditing.push("name");
  //   }

  //   return initialFieldsEditing;
  // });

  // const isFieldEditing = (field: string) => {
  //   return fieldsEditing.indexOf(field) !== -1;
  // };

  // const [editedFields, setEditedFields] = React.useState<string[]>([]);
  const formikRef = useInsertFormikErrors(externalErrors);

  // const diffChanges = (formikProps: EditOrgFormFormikProps) => {
  //   const confirmedEdited = editedFields.filter((field) => {
  //     const initialValue = value[field];
  //     const currentValue = formikProps.values[field];

  //     return initialValue !== currentValue;
  //   });

  //   if (confirmedEdited.length < editedFields.length) {
  //     setEditedFields(confirmedEdited);
  //   }
  // };

  // const debouncedDiffChanges = debounce(diffChanges, 500);

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

  const renderNameInput = (formikProps: EditOrgFormFormikProps) => {
    const { touched, values, errors } = formikProps;
    const orgExistsMessage = doesOrgExist(formikProps.errors as any);

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
            onBlur={formikProps.handleBlur}
            onChange={formikProps.handleChange}
            value={values.name}
            placeholder="Enter organization name"
            disabled={isSubmitting}
            maxLength={blockConstants.maxNameLength}
          />
        ) : (
          <Typography.Paragraph
            editable={{
              onChange: (val) => {
                formikProps.setFieldValue("name", val);
              },
            }}
          >
            {values.name}
          </Typography.Paragraph>
        )}
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
                formikProps.setFieldValue("description", val);
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

  const renderForm = (formikProps: EditOrgFormFormikProps) => {
    const { handleSubmit } = formikProps;
    const errors = (formikProps.errors as any) as EditOrgFormErrors;
    formikRef.current = formikProps;

    return (
      <StyledForm onSubmit={handleSubmit}>
        <StyledContainer s={formContentWrapperStyle}>
          <StyledContainer s={formInputContentWrapperStyle}>
            {errors.error && <FormError error={errors.error} />}
            {renderNameInput(formikProps)}
            {renderDescriptionInput(formikProps)}
          </StyledContainer>
          {renderControls()}
        </StyledContainer>
      </StyledForm>
    );
  };

  return (
    <Formik
      initialValues={value}
      validationSchema={blockValidationSchemas.org}
      onSubmit={onSubmit}
    >
      {(formikProps) => renderForm(formikProps)}
    </Formik>
  );
};

export default React.memo(EditOrgForm);
