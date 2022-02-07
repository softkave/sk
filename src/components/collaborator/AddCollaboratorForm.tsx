import { Button, Form } from "antd";
import isBoolean from "lodash/isBoolean";
import isString from "lodash/isString";
import React from "react";
import { ArrowLeft, Plus } from "react-feather";
import * as yup from "yup";
import { blockConstants } from "../../models/block/constants";
import { ICollaborationRequest } from "../../models/collaborationRequest/types";
import { ICollaborator } from "../../models/collaborator/types";
import ErrorMessages from "../../models/messages";
import { notificationConstants } from "../../models/notification/constants";
import { notificationErrorMessages } from "../../models/notification/notificationErrorMessages";
import { userErrorMessages } from "../../models/user/userErrorMessages";
import { getNewId } from "../../utils/utils";
import FormError from "../forms/FormError";
import { getFormError, IFormikFormErrors } from "../forms/formik-utils";
import {
  formContentWrapperStyle,
  formInputContentWrapperStyle,
  StyledForm,
} from "../forms/FormStyledComponents";
import useFormHelpers from "../hooks/useFormHelpers";
import StyledContainer from "../styled/Container";
import AddCollaboratorFormItem, {
  IAddCollaboratorFormItemValues,
} from "./AddCollaboratorFormItem";

const emailExistsErrorMessage = "Email addresss has been entered already";

const requestSchema = yup.object().shape({
  email: yup
    .string()
    .trim()
    .email(userErrorMessages.invalidEmail)
    .required(ErrorMessages.EMAIL_ADDRESS_IS_REQUIRED), // TODO: Central place for error messages
});

const validationSchema = yup.object().shape({
  message: yup
    .string()
    .trim()
    .max(notificationConstants.maxAddCollaboratorMessageLength),
  expiresAt: yup.number(),
  collaborators: yup
    .array()
    .of(requestSchema)
    .min(blockConstants.minAddCollaboratorValuesLength)
    .max(blockConstants.maxAddCollaboratorValuesLength)
    .required(),
});

export interface IAddCollaboratorFormValues {
  collaborators: IAddCollaboratorFormItemValues[];
}

export type AddCollaboratorFormErrors =
  IFormikFormErrors<IAddCollaboratorFormValues>;

export interface IAddCollaboratorFormProps {
  existingCollaborators: ICollaborator[];
  existingCollaborationRequests: ICollaborationRequest[];
  value: IAddCollaboratorFormValues;
  onClose: () => void;
  onSubmit: (values: IAddCollaboratorFormValues) => void;
  isSubmitting?: boolean;
  errors?: AddCollaboratorFormErrors;
}

const AddCollaboratorForm: React.FC<IAddCollaboratorFormProps> = (props) => {
  const {
    existingCollaborators,
    existingCollaborationRequests,
    value,
    onClose,
    onSubmit,
    isSubmitting,
    errors: externalErrors,
  } = props;

  const getEmailConflict = (email: string, itemIndex: number) => {
    const collaborators = formik.values.collaborators;
    email = email.toLowerCase();
    let exists =
      collaborators.findIndex((req, i) => {
        if (i === itemIndex) {
          return false;
        }

        return req.email.toLowerCase() === email;
      }) !== -1;

    if (exists) {
      return emailExistsErrorMessage;
    }

    exists =
      existingCollaborators.findIndex(
        (user) => user.email.toLowerCase() === email
      ) !== -1;

    if (exists) {
      return notificationErrorMessages.sendingRequestToAnExistingCollaborator;
    }

    exists =
      existingCollaborationRequests.findIndex(
        (req) => req.to.email.toLowerCase() === email
      ) !== -1;

    if (exists) {
      return notificationErrorMessages.requestHasBeenSentBefore;
    }
  };

  const internalOnSubmit = (values: IAddCollaboratorFormValues) => {
    // TODO: handle confict errors this way for now, and put them with validation
    // using the validation schema in the validate function as formik prop
    let hasError = false;
    const errs = formik.values.collaborators.map((req, i) => {
      const emailConflictError = getEmailConflict(req.email, i);

      if (emailConflictError) {
        hasError = true;
        return { email: emailConflictError };
      }

      return undefined;
    });

    if (hasError) {
      formik.setFieldError("collaborators", errs as any);
      return;
    }

    onSubmit({
      collaborators: values.collaborators,
    });
  };

  const { formik, formikHelpers, formikChangedFieldsHelpers } = useFormHelpers({
    errors: externalErrors,
    formikProps: {
      initialValues: value,
      onSubmit: internalOnSubmit,
      validationSchema,
    },
  });

  const onDelete = (index: number) => {
    formikHelpers.deleteInArrayField("collaborators", index);
    formikChangedFieldsHelpers.addField("collaborators");
  };

  const onChange = (
    index: number,
    data: Partial<IAddCollaboratorFormItemValues>
  ) => {
    const emailPath = `collaborators.[${index}].email`;
    const changedFields = Object.keys(data);

    if (changedFields.includes("email")) {
      formik.setFieldValue(emailPath, data.email);
    }

    formikChangedFieldsHelpers.addField("collaborators");
  };

  const onAddNewStatus = () => {
    const status: IAddCollaboratorFormItemValues = {
      email: "",
      customId: getNewId(),
    };

    formikHelpers.addToArrayField("collaborators", status, {}, {});
    formikChangedFieldsHelpers.addField("collaborators");
  };

  const renderLabel = () => {
    return (
      <StyledContainer
        s={{
          width: "100%",
          lineHeight: "40px",
          fontWeight: 600,
          alignItems: "center",
        }}
      >
        <StyledContainer s={{ flex: 1 }}>Requests</StyledContainer>
        <Button
          disabled={
            isSubmitting ||
            formik.values.collaborators.length >=
              blockConstants.maxAddCollaboratorValuesLength
          }
          onClick={() => onAddNewStatus()}
          htmlType="button"
          className="icon-btn"
        >
          <Plus />
        </Button>
      </StyledContainer>
    );
  };

  const renderCollaboratorsListInput = () => {
    const { touched, errors, values } = formik;

    return (
      <Form.Item
        help={
          isBoolean(touched.collaborators) &&
          isString(errors.collaborators) && (
            <FormError>{errors.collaborators}</FormError>
          )
        }
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
      >
        {renderLabel()}
        {values.collaborators.map((collaborator, i) => {
          return (
            <AddCollaboratorFormItem
              onChange={(val) => onChange(i, val)}
              onDelete={() => onDelete(i)}
              value={collaborator}
              disabled={isSubmitting}
              errors={(errors.collaborators || [])[i] as any}
              key={collaborator.customId}
              touched={(touched.collaborators || [])[i]}
              style={{
                padding: "24px 0px",
                borderBottom:
                  i < formik.values.collaborators.length - 1
                    ? "1px solid #f0f0f0"
                    : undefined,
              }}
            />
          );
        })}
      </Form.Item>
    );
  };

  const renderControls = () => {
    return (
      <StyledContainer>
        <Button
          block
          type="primary"
          htmlType="submit"
          loading={isSubmitting}
          disabled={!formikChangedFieldsHelpers.hasChanges()}
        >
          Send Requests
        </Button>
      </StyledContainer>
    );
  };

  const renderForm = () => {
    const { errors, handleSubmit } = formik;
    const globalError = getFormError(errors);

    return (
      <StyledForm onSubmit={handleSubmit}>
        <StyledContainer s={formContentWrapperStyle}>
          <StyledContainer s={formInputContentWrapperStyle}>
            <StyledContainer s={{ paddingBottom: "16px" }}>
              <Button
                style={{ cursor: "pointer" }}
                onClick={onClose}
                className="icon-btn"
              >
                <ArrowLeft />
              </Button>
            </StyledContainer>
            {globalError && (
              <Form.Item>
                <FormError error={globalError} />
              </Form.Item>
            )}
            {renderCollaboratorsListInput()}
          </StyledContainer>
          {renderControls()}
        </StyledContainer>
      </StyledForm>
    );
  };

  return renderForm();
};

export default React.memo(AddCollaboratorForm);
