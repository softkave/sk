import { Button, Form, Input } from "antd";
import { Formik, FormikProps } from "formik";
import isArray from "lodash/isArray";
import isString from "lodash/isString";
import moment from "moment";
import React from "react";
import * as yup from "yup";
import { blockConstants } from "../../models/block/constants";
import ErrorMessages from "../../models/errorMessages";
import { notificationConstants } from "../../models/notification/constants";
import { INotification } from "../../models/notification/notification";
import { notificationErrorMessages } from "../../models/notification/notificationErrorMessages";
import { IUser } from "../../models/user/user";
import { userErrorMessages } from "../../models/user/userErrorMessages";
import { getErrorMessageWithMax } from "../../models/validationErrorMessages";
import findItem from "../../utils/findItem";
import FormError from "../form/FormError";
import { getGlobalError, IFormikFormErrors } from "../form/formik-utils";
import {
  FormBody,
  FormBodyContainer,
  FormControls,
  StyledForm,
} from "../form/FormStyledComponents";
import StyledButton from "../styled/Button";
import {
  IAddCollaboratorFormItemError,
  IAddCollaboratorFormItemValues,
} from "./AddCollaboratorFormItem.jsx";
import AddCollaboratorFormItemList from "./AddCollaboratorFormItemList";
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
  requests: IAddCollaboratorFormItemValues[];
}

type AddCollaboratorFormFormikProps = FormikProps<IAddCollaboratorFormValues>;
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
  errors?: IAddCollaboratorFormItemError;
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

  const getErrorFromRequests = (requests: IAddCollaboratorFormItemValues[]) => {
    const errors: Array<
      IAddCollaboratorFormItemError | undefined
    > = requests.map((req, index) => {
      const existingRequest = findItem(
        requests,
        req,
        (request1, request2) => request1.email === request2.email,
        index
      );

      if (existingRequest) {
        return { email: emailExistsErrorMessage };
      }

      const collaborator = findItem(
        existingCollaborators,
        req,
        (user, requestItem) => user.email === requestItem.email
      );

      if (collaborator) {
        return {
          email:
            notificationErrorMessages.sendingRequestToAnExistingCollaborator,
        };
      }

      const notification = findItem(
        existingCollaborationRequests,
        req,
        (notificationItem, requestItem) =>
          notificationItem.to.email === requestItem.email
      );

      if (notification) {
        return { email: notificationErrorMessages.requestHasBeenSentBefore };
      }

      return undefined;
    });

    return errors;
  };

  const renderDefaultMessageInput = (
    formikProps: AddCollaboratorFormFormikProps
  ) => {
    const { touched, errors, values, handleChange, handleBlur } = formikProps;

    return (
      <Form.Item
        label="Default Message"
        help={touched.message && <FormError>{errors.message}</FormError>}
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
        />
      </Form.Item>
    );
  };

  const renderDefaultExpirationInput = (
    formikProps: AddCollaboratorFormFormikProps
  ) => {
    const { touched, errors, values, setFieldValue } = formikProps;

    return (
      <Form.Item
        label="Default Expiration Date"
        help={touched.expiresAt && <FormError>{errors.expiresAt}</FormError>}
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
      >
        <ExpiresAt
          minDate={moment().subtract(1, "day").endOf("day")}
          onChange={(val) => setFieldValue("expiresAt", val)}
          value={values.expiresAt}
        />
      </Form.Item>
    );
  };

  const renderCollaboratorsListInput = (
    formikProps: AddCollaboratorFormFormikProps
  ) => {
    const {
      touched,
      errors,
      values,
      setFieldValue,
      setFieldError,
    } = formikProps;

    return (
      <Form.Item
        label="Requests"
        help={
          touched.requests &&
          isString(errors.requests) && <FormError>{errors.requests}</FormError>
        }
        labelCol={{ span: 24 }}
        wrapperCol={{ span: 24 }}
      >
        <AddCollaboratorFormItemList
          value={values.requests}
          maxRequests={blockConstants.maxAddCollaboratorValuesLength}
          onChange={(val) => {
            setFieldValue("requests", val);
            setFieldError("requests", getErrorFromRequests(val) as any);
          }}
          // TODO: fix error
          // @ts-ignore
          errors={isArray(errors.requests) ? errors.requests : undefined}
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
          Send Requests
        </Button>
      </FormControls>
    );
  };

  const renderForm = (formikProps: AddCollaboratorFormFormikProps) => {
    const { errors, handleSubmit } = formikProps;
    const globalError = getGlobalError(errors);

    return (
      <StyledForm onSubmit={handleSubmit}>
        <FormBodyContainer>
          <FormBody>
            {globalError && (
              <Form.Item>
                <FormError error={globalError} />
              </Form.Item>
            )}
            {renderDefaultMessageInput(formikProps)}
            {renderDefaultExpirationInput(formikProps)}
            {renderCollaboratorsListInput(formikProps)}
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
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {(formikProps) => renderForm(formikProps)}
    </Formik>
  );
};

export default React.memo(AddCollaboratorForm);
