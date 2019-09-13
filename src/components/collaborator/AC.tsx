import { Button, Form, Input } from "antd";
import { Formik } from "formik";
import moment from "moment";
import React from "react";
import * as yup from "yup";

import { blockConstants } from "../../models/block/constants.js";
import { notificationConstants } from "../../models/notification/constants";
import { INotification } from "../../models/notification/notification.js";
import { notificationErrorMessages } from "../../models/notification/notificationErrorMessages";
import { IUser } from "../../models/user/user.js";
import { userErrorMessages } from "../../models/user/userErrorMessages.js";
import { getErrorMessageWithMax } from "../../models/validationErrorMessages.js";
import FormError from "../form/FormError";
import {
  FormBody,
  FormBodyContainer,
  FormControls,
  FormScrollList,
  StyledForm
} from "../form/FormInternals";
import { getGlobalError, submitHandler } from "../formik-utils";
import modalWrap from "../modalWrap.jsx";
import ACF from "./ACF";
import ACFExpiresAt from "./ACFExpiresAt";
import { IACFItemValue } from "./ACFItem.jsx";

const emailExistsErrorMessage = "Email addresss has been entered already";

const validationSchema = yup.object().shape({
  message: yup
    .string()
    .max(notificationConstants.maxAddCollaboratorMessageLength),
  expiresAt: yup.number(),
  requests: yup
    .array()
    .of(
      yup.object().shape({
        email: yup.string().email(userErrorMessages.invalidEmail),
        body: yup
          .string()
          .max(notificationConstants.maxAddCollaboratorMessageLength, () => {
            return getErrorMessageWithMax(
              notificationConstants.maxAddCollaboratorMessageLength,
              "string"
            );
          }),
        expiresAt: yup.number()
      })
    )
    .max(blockConstants.maxAddCollaboratorValuesLength)
    .required()
});

// TODO: Test not allowing action on an expired collaboration request

export interface IACValue {
  message?: string;
  expiresAt?: number;
  requests: IACFItemValue[];
}

export interface IACProp {
  existingCollaborators: IUser[];
  existingCollaborationRequests: INotification[];
  onSendRequests: (value: IACValue) => void;
}

class AC extends React.PureComponent<IACProp> {
  public render() {
    const { onSendRequests } = this.props;

    return (
      <Formik
        initialValues={{
          message: undefined,
          expiresAt: undefined,
          requests: []
        }}
        onSubmit={(values, props) => {
          // TODO: Test for these errors during change, maybe by adding unique or test function to the schema
          const errors = this.validateRequests(values.requests);

          if (errors) {
            props.setErrors({ requests: errors });
            props.setSubmitting(false);
            return;
          }

          submitHandler(onSendRequests, values, props);
        }}
        validationSchema={validationSchema}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          setFieldValue
        }) => {
          const globalError = getGlobalError(errors);

          return (
            <StyledForm onSubmit={handleSubmit}>
              <FormBodyContainer>
                <FormScrollList>
                  <FormBody>
                    {globalError && (
                      <Form.Item>
                        <FormError error={globalError} />
                      </Form.Item>
                    )}
                    <Form.Item
                      label="Default Message"
                      help={<FormError>{errors.message}</FormError>}
                    >
                      <Input.TextArea
                        autosize={{ minRows: 2, maxRows: 6 }}
                        autoComplete="off"
                        name="message"
                        value={values.message}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </Form.Item>
                    <Form.Item
                      label="Default Expiration Date"
                      help={<FormError>{errors.expiresAt}</FormError>}
                    >
                      <ACFExpiresAt
                        minDate={moment()
                          .subtract(1, "day")
                          .endOf("day")}
                        onChange={value => setFieldValue("expiresAt", value)}
                        value={values.expiresAt}
                      />
                    </Form.Item>
                    <Form.Item label="Requests">
                      <ACF
                        value={values.requests}
                        maxRequests={
                          blockConstants.maxAddCollaboratorValuesLength
                        }
                        onChange={value => {
                          setFieldValue("requests", value);
                        }}
                        errors={errors.requests as any}
                      />
                    </Form.Item>
                  </FormBody>
                </FormScrollList>
                <FormControls>
                  <Button
                    block
                    type="primary"
                    htmlType="submit"
                    loading={isSubmitting}
                  >
                    Send Requests
                  </Button>
                </FormControls>
              </FormBodyContainer>
            </StyledForm>
          );
        }}
      </Formik>
    );
  }

  private validateRequests = value => {
    const { existingCollaborationRequests, existingCollaborators } = this.props;
    function findRequest(requests, request, excludeIndex) {
      return requests.find((next, index) => {
        return next.email === request.email && index !== excludeIndex;
      });
    }

    function setError(errorArray, index, field, error) {
      const errorsInIndex = errorArray[index] || {};
      const errorsForField = errorsInIndex[field] || [];
      errorsForField.push(error);
      errorsInIndex[field] = errorsForField;
      errorArray[index] = errorsInIndex;
    }

    const errors = [];

    value.forEach((request, index) => {
      if (findRequest(value, request, index)) {
        setError(errors, index, "email", emailExistsErrorMessage);
        return;
      }

      const exCol = existingCollaborators.find(col => {
        return col.email === request.email;
      });

      if (exCol) {
        setError(
          errors,
          index,
          "email",
          notificationErrorMessages.sendingRequestToAnExistingCollaborator
        );

        return;
      }

      const exReq = existingCollaborationRequests.find(req => {
        return req.to.email === request.email;
      });

      if (exReq) {
        setError(
          errors,
          index,
          "email",
          notificationErrorMessages.requestHasBeenSentBefore
        );
      }
    });

    if (errors.length > 0) {
      return errors;
    }
  };
}

export default modalWrap(AC, "Collaboration Request");
