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
import { indexArray } from "../../utils/object";
import FormError from "../FormError";
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
        email: yup.string().email(),
        body: yup
          .string()
          .max(notificationConstants.maxAddCollaboratorMessageLength),
        expiresAt: yup.number()
      })
    )
    .max(blockConstants.maxAddCollaboratorValuesLength)
    .required()
});

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
  public indexedExistingUsersEmail = {};
  public indexedExistingRequestsEmail = {};

  public componentDidMount() {
    const { existingCollaborators, existingCollaborationRequests } = this.props;

    if (Array.isArray(existingCollaborators)) {
      this.indexedExistingUsersEmail = indexArray(existingCollaborators, {
        path: "email"
      });
    }

    if (Array.isArray(existingCollaborationRequests)) {
      this.indexedExistingRequestsEmail = indexArray(
        existingCollaborationRequests,
        {
          path: "to.email"
        }
      );
    }
  }

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
            <form onSubmit={handleSubmit}>
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
                  maxRequests={blockConstants.maxAddCollaboratorValuesLength}
                  onChange={value => setFieldValue("requests", value)}
                  errors={errors.requests as any}
                />
              </Form.Item>
              <Form.Item>
                <Button
                  block
                  type="primary"
                  htmlType="submit"
                  loading={isSubmitting}
                >
                  Send Requests
                </Button>
              </Form.Item>
            </form>
          );
        }}
      </Formik>
    );
  }

  private validateRequests = value => {
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
      } else if (this.indexedExistingUsersEmail[request.email]) {
        setError(
          errors,
          index,
          "email",
          notificationErrorMessages.sendingRequestToAnExistingCollaborator
        );
      } else if (this.indexedExistingRequestsEmail[request.email]) {
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
