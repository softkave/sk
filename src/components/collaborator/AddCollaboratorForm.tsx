import { PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input } from "antd";
import isString from "lodash/isString";
import moment from "moment";
import React from "react";
import * as yup from "yup";
import { blockConstants } from "../../models/block/constants";
import ErrorMessages from "../../models/errorMessages";
import { notificationConstants } from "../../models/notification/constants";
import { INotification } from "../../models/notification/notification";
import { notificationErrorMessages } from "../../models/notification/notificationErrorMessages";
import { IAddCollaboratorFormItemValues } from "../../models/types";
import { IUser } from "../../models/user/user";
import { userErrorMessages } from "../../models/user/userErrorMessages";
import { getErrorMessageWithMax } from "../../models/validationErrorMessages";
import { newId } from "../../utils/utils";
import FormError from "../form/FormError";
import { getGlobalError, IFormikFormErrors } from "../form/formik-utils";
import {
  formContentWrapperStyle,
  formInputContentWrapperStyle,
  StyledForm,
} from "../form/FormStyledComponents";
import useFormikExtended from "../hooks/useFormikExtended";
import StyledButton from "../styled/Button";
import StyledContainer from "../styled/Container";
import AddCollaboratorFormItem from "./AddCollaboratorFormItem";
import ExpiresAt from "./ExpiresAt";

const emailExistsErrorMessage = "Email addresss has been entered already";

const requestSchema = yup.object().shape({
  email: yup
    .string()
    .email(userErrorMessages.invalidEmail)
    .required(ErrorMessages.emailAddressRequired), // TODO: Central place for error messages
  body: yup
    .string()
    .max(notificationConstants.maxAddCollaboratorMessageLength, () => {
      return getErrorMessageWithMax(
        notificationConstants.maxAddCollaboratorMessageLength,
        "string"
      );
    }),
  expiresAt: yup.number(),
});

const validationSchema = yup.object().shape({
  message: yup
    .string()
    .max(notificationConstants.maxAddCollaboratorMessageLength),
  expiresAt: yup.number(),
  requests: yup
    .array()
    .of(requestSchema)
    .min(blockConstants.minAddCollaboratorValuesLength)
    .max(blockConstants.maxAddCollaboratorValuesLength)
    .required(),
});

// TODO: Test not allowing action on an expired collaboration request
export interface IAddCollaboratorFormValues {
  message?: string;
  expiresAt?: number;
  collaborators: IAddCollaboratorFormItemValues[];
}

export type AddCollaboratorFormErrors = IFormikFormErrors<
  IAddCollaboratorFormValues
>;

export interface IAddCollaboratorFormProps {
  existingCollaborators: IUser[];
  existingCollaborationRequests: INotification[];
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

  const internalOnSubmit = (values: IAddCollaboratorFormValues) => {
    onSubmit({
      expiresAt: values.expiresAt,
      message: values.message,
      collaborators: values.collaborators.map((collaborator) => ({
        email: collaborator.email,
        body: collaborator.body,
        expiresAt: collaborator.expiresAt,
      })),
    });
  };

  const {
    formik,
    deleteIndexInArrayField,
    addNewValueToArrayField,
  } = useFormikExtended({
    errors: externalErrors,
    formikProps: {
      initialValues: value,
      onSubmit: internalOnSubmit,
      validationSchema,
    },
  });

  const getEmailConflict = (email: string, itemIndex: number) => {
    const requests = formik.values.collaborators;

    let exists = !!requests.find((req, i) => {
      if (i === itemIndex) {
        return false;
      }

      return req.email === email;
    });

    if (exists) {
      return emailExistsErrorMessage;
    }

    exists = !!existingCollaborators.find((user) => user.email === email);

    if (exists) {
      return notificationErrorMessages.sendingRequestToAnExistingCollaborator;
    }

    exists = !!existingCollaborationRequests.find(
      (req) => req.to.email === email
    );

    if (exists) {
      return notificationErrorMessages.requestHasBeenSentBefore;
    }
  };

  const renderDefaultMessageInput = () => {
    const { touched, errors, values, handleChange, handleBlur } = formik;

    return (
      <Form.Item
        label="Default Message"
        help={touched.message && <FormError error={errors.message} />}
        extra="This message is added to every request without a message"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
      >
        <Input.TextArea
          autoSize={{ minRows: 2, maxRows: 6 }}
          autoComplete="off"
          name="message"
          value={values.message}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Enter default message"
          disabled={isSubmitting}
        />
      </Form.Item>
    );
  };

  const renderDefaultExpirationInput = () => {
    const { touched, errors, values, setFieldValue } = formik;

    return (
      <Form.Item
        label="Default Expiration Date"
        help={touched.expiresAt && <FormError error={errors.expiresAt} />}
        extra="This date is added to every request without one"
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
      >
        <ExpiresAt
          minDate={moment().subtract(1, "day").endOf("day")}
          onChange={(val) => setFieldValue("expiresAt", val)}
          value={values.expiresAt}
          placeholder="Select default expiration date"
          disabled={isSubmitting}
          style={{ width: "100%" }}
        />
      </Form.Item>
    );
  };

  const onDelete = (index: number) => {
    deleteIndexInArrayField("statusList", index);
  };

  const onChange = (
    index: number,
    data: Partial<IAddCollaboratorFormItemValues>
  ) => {
    const emailPath = `statusList.[${index}].email`;
    const bodyPath = `statusList.[${index}].body`;
    const expiresAtPath = `statusList.[${index}].expiresAt`;

    if (data.email) {
      formik.setFieldValue(emailPath, data.email);

      const emailError = getEmailConflict(data.email, index);

      if (emailError) {
        formik.setFieldError(emailPath, emailError);
      }
    } else if (data.body) {
      formik.setFieldValue(bodyPath, data.body);
    } else if (data.expiresAt) {
      formik.setFieldValue(expiresAtPath, data.expiresAt);
    }
  };

  const onAddNewStatus = () => {
    const status: IAddCollaboratorFormItemValues & { customId: string } = {
      email: "",
      body: "",
      customId: newId(),
    };

    addNewValueToArrayField("collaborators", status, {}, {});
  };

  const renderAddControls = () => {
    return (
      <StyledContainer s={{}}>
        <Button
          disabled={
            isSubmitting ||
            formik.values.collaborators.length >=
              blockConstants.maxAddCollaboratorValuesLength
          }
          icon={<PlusOutlined />}
          onClick={() => onAddNewStatus()}
          htmlType="button"
        >
          New Request
        </Button>
      </StyledContainer>
    );
  };

  const renderCollaboratorsListInput = () => {
    const { touched, errors, values } = formik;

    return (
      <Form.Item
        label="Requests"
        help={
          touched.collaborators &&
          isString(errors.collaborators) && (
            <FormError>{errors.collaborators}</FormError>
          )
        }
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
      >
        {renderAddControls()}
        {values.collaborators.map((collaborator, i) => {
          return (
            <AddCollaboratorFormItem
              onChange={(val) => onChange(i, val)}
              onDelete={() => onDelete(i)}
              value={collaborator}
              disabled={isSubmitting}
              errors={(errors.collaborators || [])[i] as any}
              key={(collaborator as any).customId}
              touched={(touched.collaborators || [])[i]}
              style={{
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
          Send Requests
        </Button>
      </StyledContainer>
    );
  };

  const renderForm = () => {
    const { errors, handleSubmit } = formik;
    const globalError = getGlobalError(errors);

    return (
      <StyledForm onSubmit={handleSubmit}>
        <StyledContainer s={formContentWrapperStyle}>
          <StyledContainer s={formInputContentWrapperStyle}>
            {globalError && (
              <Form.Item>
                <FormError error={globalError} />
              </Form.Item>
            )}
            {renderDefaultMessageInput()}
            {renderDefaultExpirationInput()}
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
