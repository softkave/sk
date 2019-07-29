import { Button, Form, Input } from "antd";
import { Formik } from "formik";
import moment from "moment";
import React from "react";
import yup from "yup";

import { blockConstants } from "../../models/block/constants.js";
import { notificationConstants } from "../../models/notification/constants";
import { notificationErrorMessages } from "../../models/notification/notificationErrorMessages";
import { indexArray } from "../../utils/object.js";
import FormError from "../FormError.jsx";
import { getGlobalError, submitHandler } from "../formik-utils.js";
import modalWrap from "../modalWrap.jsx";
import ACF from "./ACF";
import ACFExpiresAt from "./ACFExpiresAt.jsx";

const emailExistsError = "Email addresss has been entered already";

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

interface IACValue {
  message?: string;
  expiresAt?: number;
  requests: IACValue[];
}

export interface IACProp {
  existingCollaborators: any[];
  existingCollaborationRequests: any[];
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
          path: "email"
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
        onSubmit={(values, { setErrors }) => {
          // TODO: Test for these errors during change, maybe by adding unique or test function to the schema
          const requestError = this.validateRequests(values.requests);

          if (requestError) {
            setErrors({ requests: requestError });
            return;
          }

          submitHandler(onSendRequests, values, { setErrors });
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

    function setError(err, index, field, error) {
      const indexError = err[index] || {};
      const fieldError = indexError[field] || [];
      fieldError.push(error);
      indexError[field] = fieldError;
      err[index] = indexError;
    }

    const errors = [];

    value.forEach((request, index) => {
      if (findRequest(value, request, index)) {
        setError(errors, index, "email", emailExistsError);
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
