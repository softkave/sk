import React from "react";
import { Button, Form, Spin } from "antd";
import PropTypes from "prop-types";
import moment from "moment";
import isEmail from "validator/lib/isEmail";

import modalWrap from "../modalWrap.jsx";
import ACF from "./ACF";
import { indexArray } from "../../utils/object.js";
import ACFMessage from "./ACFMessage.jsx";
import ACFExpiresAt from "./ACFExpiresAt.jsx";
import { constructSubmitHandler } from "../form-utils.js";
import {
  validationErrorMessages,
  getErrorMessageWithMax
} from "../../models/validationErrorMessages";
import { userErrorMessages } from "../../models/user/userErrorMessages";
import {
  notificationErrorMessages,
  notificationErrorFields
} from "../../models/notification/notificationErrorMessages";
import { notificationConstants } from "../../models/notification/constants";
import { serverErrorFields } from "../../models/serverErrorMessages.js";
import { blockConstants } from "../../models/block/constants.js";
import FormError from "../FormError.jsx";

const emailExistsError = "Email addresss has been entered already";

const defaultExpirationDate = moment().add(1, "M");

const ACPropTypes = {
  existingCollaborators: PropTypes.array,
  existingCollaborationRequests: PropTypes.array,
  onSendRequests: PropTypes.func.isRequired
};

class AC extends React.PureComponent {
  static propTypes = ACPropTypes;

  indexedExistingUsersEmail = {};
  indexedExistingRequestsEmail = {};
  state = {
    isLoading: false,
    error: null
  };

  componentDidMount() {
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

  validateRequests = value => {
    console.log(value, "L");
    // const indexedEmails = indexArray(value, { path: "email" });

    function findRequest(requests, request, excludeIndex) {
      return requests.find((next, index) => {
        return next.email === request.email && index !== excludeIndex;
      });
    }

    value.forEach((request, index) => {
      if (typeof request.email !== "string" || request.email.length === 0) {
        request.emailError = validationErrorMessages.requiredError;
      } else if (!isEmail(request.email)) {
        request.emailError = userErrorMessages.invalidEmail;
      } else if (findRequest(value, request, index)) {
        request.emailError = emailExistsError;
      } else if (this.indexedExistingUsersEmail[request.email]) {
        request.emailError =
          notificationErrorMessages.sendingRequestToAnExistingCollaborator;
      } else if (this.indexedExistingRequestsEmail[request.email]) {
        request.emailError = notificationErrorMessages.requestHasBeenSentBefore;
      } else {
        request.emailError = null;
      }

      if (request.body && request.body.length > notificationConstants) {
        request.bodyError = getErrorMessageWithMax(
          notificationConstants.maxAddCollaboratorMessageLength,
          "string"
        );
      } else {
        request.bodyError = null;
      }
    });

    return value;
  };

  processValues = values => {
    values.collaborators = this.validateRequests(values.collaborators);
    const hasError = !!values.collaborators.find(request => {
      return request.emailError || request.bodyError;
    });

    if (hasError) {
      return { hasError, values };
    }

    values.expiresAt = values.expiresAt.valueOf();
    values.collaborators = values.collaborators.map(request => {
      return {
        email: request.email,
        body: request.body,
        expiresAt: request.expiresAt
          ? moment(request.expiresAt).valueOf()
          : undefined
      };
    });

    return { values };
  };

  processRequestError = (requests, fieldErrors, indexedErrors) => {
    function getOtherRequestEmailErrors(indexedErrors) {
      const systemErrors = indexedErrors["system"];
      const otherEmailErrors = {};

      if (Array.isArray(systemErrors)) {
        systemErrors.forEach(error => {
          const fieldNameArray = error.field.split(".");
          const emailErrorType = fieldNameArray[2];
          const emailAddress = fieldNameArray[3];

          switch (emailErrorType) {
            case notificationErrorFields.requestHasBeenSentBefore:
            case notificationErrorFields.sendingRequestToAnExistingCollaborator:
              otherEmailErrors[emailAddress] = error;
              break;

            default:
              return;
          }
        });
      }

      return otherEmailErrors;
    }

    if (Array.isArray(fieldErrors)) {
      fieldErrors.forEach(error => {
        const fieldNameArray = error.field.split(".");
        const requestIndex = Number(fieldNameArray[1]);
        const requestErrorFieldName = fieldNameArray[2];

        if (typeof requestIndex === "number") {
          const request = requests[requestIndex];

          if (typeof requestErrorFieldName === "string") {
            request[`${requestErrorFieldName}Error`] = error.body;
          } else {
            request.error = error.message;
          }
        }
      });
    } else {
      const otherEmailErrors = getOtherRequestEmailErrors(indexedErrors);

      if (Object.keys(otherEmailErrors).length > 0) {
        requests.forEach(request => {
          const error = otherEmailErrors[request.email];

          if (error) {
            request.emailError = error.message;
          }
        });
      }
    }

    return { value: requests };
  };

  processFieldError = (fieldName, value, fieldErrors, indexedErrors) => {
    switch (fieldName) {
      case "body":
      case "expiresAt":
        return { value, errors: fieldErrors };

      case "requests":
        return this.processRequestError(value, fieldErrors, indexedErrors);

      default:
        return { value };
    }
  };

  getSubmitHandler = () => {
    const { form, onSendRequests } = this.props;

    return constructSubmitHandler({
      form,
      submitCallback: onSendRequests,
      process: this.processValues,
      processFieldError: this.processFieldError,
      beforeProcess: () => this.setState({ isLoading: true, error: null }),
      afterErrorProcess: indexedErrors => {
        if (Array.isArray(indexedErrors.error) && indexedErrors.error[0]) {
          this.setState({ error: indexedErrors.error[0].message });
        }
      },
      completedProcess: () => this.setState({ isLoading: false }),
      transformErrorMap: [
        {
          field: serverErrorFields.serverError,
          toField: "error"
        }
      ]
      // transformErrorField: error => {
      //   const mapArray = [
      //     notificationErrorFields.requestHasBeenSentBefore,
      //     notificationErrorFields.sendingRequestToAnExistingCollaborator
      //   ];

      // }
    });
  };

  render() {
    const { form } = this.props;
    const { isLoading, error } = this.state;

    return (
      <Spin spinning={isLoading}>
        <Form hideRequiredMark onSubmit={this.getSubmitHandler()}>
          {error && <FormError>{error}</FormError>}
          <Form.Item label="Default Message">
            {form.getFieldDecorator("body", {
              getValueFromEvent: data => data,
              rules: [
                {
                  type: "string",
                  max: notificationConstants.maxAddCollaboratorMessageLength
                }
              ],
              initialValue: ""
            })(<ACFMessage />)}
          </Form.Item>
          <Form.Item label="Default Expiration Date">
            {form.getFieldDecorator("expiresAt", {
              getValueFromEvent: data => data,
              initialValue: defaultExpirationDate
            })(
              <ACFExpiresAt
                minDate={moment()
                  .subtract(1, "day")
                  .endOf("day")}
              />
            )}
          </Form.Item>
          <Form.Item label="Requests">
            {form.getFieldDecorator("collaborators", {
              getValueFromEvent: data => this.validateRequests(data),
              // getValueFromEvent: data => data,
              initialValue: [],
              rules: [{ required: true }],
              getValueProps: value => {
                return {
                  value,
                  maxRequests: blockConstants.maxAddCollaboratorValuesLength
                };
              }
            })(<ACF />)}
          </Form.Item>
          <Button block type="primary" htmlType="submit">
            Send Requests
          </Button>
        </Form>
      </Spin>
    );
  }
}

export default modalWrap(Form.create()(AC), "Collaboration Request");
