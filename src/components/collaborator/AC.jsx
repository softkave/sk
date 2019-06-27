import React from "react";
import { Button, Form } from "antd";
import PropTypes from "prop-types";
import modalWrap from "../modalWrap.jsx";
import moment from "moment";
import isEmail from "validator/lib/isEmail";
import ACF from "./ACF";
import { indexArray } from "../../utils/object.js";
import ACFMessage from "./ACFMessage.jsx";
import ACFExpiresAt from "./ACFExpiresAt.jsx";
import { constructSubmitHandler } from "../form-utils.js";

const invalidEmailError = "Invalid email address";
const emailExistsError = "Email addresss has been entered already";
const userExistsError = "Collaborator with email address exists";
const requestExistsError =
  "A request with this email address has been sent before";

const maxMessageLength = 500;
const messageLengthError = "Message length is more than 500 characters";

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

  // validateRequests = value => {
  //   const indexedEmails = indexArray(value, { path: "email" });

  //   value.forEach(request => {
  //     if (!isEmail(request.email)) {
  //       request.emailError = invalidEmailError;
  //     } else if (indexedEmails[request.email]) {
  //       request.emailError = emailExistsError;
  //     } else if (this.indexedExistingUsersEmail[request.email]) {
  //       request.emailError = userExistsError;
  //     } else if (this.indexedExistingRequestsEmail[request.email]) {
  //       request.emailError = requestExistsError;
  //     } else {
  //       request.emailError = null;
  //     }

  //     if (request.message && request.message.length > maxMessageLength) {
  //       request.messageError = messageLengthError;
  //     } else {
  //       request.messageError = null;
  //     }
  //   });

  //   return value;
  // };

  processValues = values => {
    const hasError = !!values.requests.find(request => {
      return request.emailError || request.messageError;
    });

    if (hasError) {
      return { hasError, values };
    }

    values.requests = values.requests.map(request => {
      return {
        email: request.email,
        message: request.message,
        expiresAt: request.expiresAt
      };
    });

    return { values };
  };

  processRequestError = (requests, errors) => {
    errors.forEach(error => {
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

    return { value: requests };
  };

  processFieldError = (fieldName, value, errors) => {
    switch (fieldName) {
      case "message":
      case "expiresAt":
        return Array.isArray(errors) ? errors[0].message : null;

      case "requests":
        return this.processRequestError(value, errors);
    }
  };

  getSubmitHandler = () => {
    const { form, onSendRequests } = this.props;

    return constructSubmitHandler({
      form,
      submitCallback: onSendRequests,
      process: this.processValues,
      processFieldError: this.processFieldError,
      beforeProcess: () => this.setState({ isLoading: true }),
      afterErrorProcess: indexedErrors => {
        if (indexedErrors.error) {
          this.setState({ error: indexedErrors.error });
        }
      },
      completedProcess: () => this.setState({ isLoading: false })
    });
  };

  render() {
    const { form } = this.props;

    return (
      <Form hideRequiredMark onSubmit={this.getSubmitHandler()}>
        <Form.Item>
          {form.getFieldDecorator("message", {
            getValueFromEvent: data => data,
            rules: [{ type: "string", max: maxMessageLength }],
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
            // getValueFromEvent: data => this.validateRequests(data),
            getValueFromEvent: data => data,
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
