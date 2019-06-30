import React from "react";
import { Button, Form } from "antd";
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

const emailExistsError = "Email addresss has been entered already";

const defaultExpirationDate = moment()
  .add(1, "months")
  .valueOf();

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
    const indexedEmails = indexArray(value, { path: "email" });

    value.forEach(request => {
      if (typeof request.email !== "string" || request.email.length === 0) {
        request.emailError = validationErrorMessages.requiredError;
      } else if (!isEmail(request.email)) {
        request.emailError = userErrorMessages.invalidEmail;
      } else if (indexedEmails[request.email]) {
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
          notificationConstants.maxAddCollaboratorBodyMessageLength,
          "string"
        );
      } else {
        request.bodyError = null;
      }
    });

    return value;
  };

  processValues = values => {
    values = this.validateRequests(values);
    const hasError = !!values.requests.find(request => {
      return request.emailError || request.bodyError;
    });

    if (hasError) {
      return { hasError, values };
    }

    values.requests = values.requests.map(request => {
      return {
        email: request.email,
        body: request.body,
        expiresAt: request.expiresAt
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
            request[`${requestErrorFieldName}Error`] = error.message;
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
        if (Array.isArray(indexedErrors.error)) {
          this.setState({ error: indexedErrors.error[0].message });
        }
      },
      completedProcess: () => this.setState({ isLoading: false })
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

    return (
      <Form hideRequiredMark onSubmit={this.getSubmitHandler()}>
        <Form.Item>
          {form.getFieldDecorator("body", {
            getValueFromEvent: data => data,
            rules: [
              {
                type: "string",
                max: notificationConstants.maxAddCollaboratorBodyMessageLength
              }
            ],
            initialValue: ""
          })(<ACFMessage />)}
        </Form.Item>
        <Form.Item>
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
          {form.getFieldDecorator("requests", {
            getValueFromEvent: data => this.validateRequests(data),
            // getValueFromEvent: data => data,
            initialValue: [],
            rules: [{ required: true }]
          })(<ACF />)}
        </Form.Item>
        <Button block type="primary" onClick={this.onSendRequests}>
          Send Requests
        </Button>
      </Form>
    );
  }
}

export default modalWrap(Form.create()(AC), "Collaboration Request");
