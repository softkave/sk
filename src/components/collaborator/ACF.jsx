import React from "react";
import { Button } from "antd";
import ACFItem from "./ACFItem";

export default class ACF extends React.PureComponent {
  validateRequests = value => {
    const indexedEmails = indexArray(value, { path: "email" });

    value.forEach(request => {
      if (!isEmail(request.email)) {
        request.emailError = invalidEmailError;
      } else if (indexedEmails[request.email]) {
        request.emailError = emailExistsError;
      } else if (this.indexedExistingUsersEmail[request.email]) {
        request.emailError = userExistsError;
      } else if (this.indexedExistingRequestsEmail[request.email]) {
        request.emailError = requestExistsError;
      } else {
        request.emailError = null;
      }

      if (request.message && request.message.length > maxMessageLength) {
        request.messageError = messageLengthError;
      } else {
        request.messageError = null;
      }
    });

    return value;
  };

  onUpdate = (index, data) => {
    const { onChange, value } = this.props;
    let request = value[index];
    request = { ...request, ...data };
    onChange(this.validateRequests(value));
  };

  onDelete = index => {
    const { onChange, value } = this.props;
    value.splice(index, 1);
    onChange(value);
  };

  onAdd = () => {
    const { onChange, value, maxRequests } = this.props;

    if (value.length < maxRequests) {
      value.push({
        email: null,
        message: null,
        expiresAt: null,
        emailError: null,
        messageError: null
      });

      onChange(value);
    }
  };

  render() {
    const { value } = this.props;

    return (
      <React.Fragment>
        {value.map((request, index) => {
          return (
            <ACFItem
              key={request.email}
              email={request.email}
              message={request.message}
              expiresAt={request.expiresAt}
              error={request.error}
              emailError={request.emailError}
              messageError={request.messageError}
              onUpdate={data => this.onUpdate(index, data)}
              onDelete={() => this.onDelete(index)}
            />
          );
        })}
        <Button block icon="plus" onClick={this.onAdd}>
          Add Collaborator
        </Button>
      </React.Fragment>
    );
  }
}
