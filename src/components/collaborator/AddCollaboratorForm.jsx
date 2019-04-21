import React from "react";
import { DatePicker, Input, Form, Button, Divider, Row, Col } from "antd";
import dotProp from "dot-prop-immutable";
import asyncValidator from "async-validator";
import {
  promisifyAsyncValidator,
  makeNameExistsValidator
} from "../../utils/descriptor";
import { waitForPromises } from "../../utils/promise";
import { indexArray } from "../../utils/object";
import moment from "moment";

export default class CollaboratorForm extends React.Component {
  constructor(props) {
    super(props);
    this.errors = {};
    let existingEmailAddrs = Object.keys({
      ...indexArray(props.existingCollaborators, { path: "email" }),
      ...indexArray(props.existingCollaborationRequests, { path: "email" })
    });

    const emailDescriptor = [
      {
        type: "email",
        required: true,
        validator: makeNameExistsValidator(
          existingEmailAddrs,
          "collaborator already exists, or has been previously sent a request"
        )
      }
    ];
    const messageDescriptor = [{ type: "string", max: 250 }];
    const descriptor = {
      email: emailDescriptor,
      message: messageDescriptor
    };

    this.validateCollaborator = new asyncValidator(descriptor);
    this.emailValidator = new asyncValidator({ email: emailDescriptor });
    this.messageValidator = new asyncValidator({ message: messageDescriptor });
    this.pValidator = promisifyAsyncValidator(
      this.validateCollaborator.validate.bind(this.validateCollaborator)
    );
  }

  clearHelpers = (index, type) => {
    if (type) {
      if (this.errors[index]) {
        this.errors[index][type] = null;
      }
    } else {
      delete this.errors[index];
    }
  };

  clearErrors = () => {
    this.errors = {};
  };

  setError = (index, emailError, messageError) => {
    this.errors[index] = { email: emailError, message: messageError };
  };

  hasError = () => {
    return !!Object.keys(this.errors).length;
  };

  getError = (index, type = "email") => {
    return dotProp.get(this.errors, `${index}.${type}`);
  };

  validate = async () => {
    const { form } = this.props;
    this.clearErrors();
    let collaborators = form.getFieldValue("collaborators");
    let validationPromises = [];
    collaborators.forEach(c => {
      validationPromises.push(this.pValidator(c));
    });

    let result = await waitForPromises(validationPromises);
    result.forEach((r, index) => {
      if (r.failed) {
        this.setError(
          index,
          dotProp.get(r.error.fields, `email.0.message`),
          dotProp.get(r.error.fields, `message.0.message`)
        );
      }
    });

    const hasError = this.hasError();

    // to force the form to re-render
    if (hasError) {
      form.setFieldsValue({ collaborators });
    }

    return !hasError;
  };

  onAddField = () => {
    const { form } = this.props;
    let collaborators = form.getFieldValue("collaborators");
    collaborators = collaborators.concat([{ email: "", expiresAt: null }]);
    form.setFieldsValue({ collaborators });
  };

  onDeleteField = index => {
    const { form } = this.props;
    let collaborators = form.getFieldValue("collaborators");
    collaborators = dotProp.delete(collaborators, index);
    this.clearHelpers(index);
    form.setFieldsValue({ collaborators });
  };

  onUpdateField = (index, field, data, validator) => {
    const { form } = this.props;
    let collaborators = form.getFieldValue("collaborators");
    validator.validate({ [field]: data }, errors => {
      if (errors) {
        this.setError(index, errors[0].message);
      } else {
        this.clearHelpers(index, field);
      }

      collaborators = dotProp.set(collaborators, `${index}.${field}`, data);
      form.setFieldsValue({ collaborators });
    });
  };

  onUpdateEmail = (index, email) => {
    this.onUpdateField(index, "email", email, this.emailValidator);
  };

  onUpdateMessage = (index, message) => {
    this.onUpdateField(index, "message", message, this.messageValidator);
  };

  onUpdateExpiresAt = (index, momentDate) => {
    const { form } = this.props;
    let collaborators = form.getFieldValue("collaborators");
    collaborators = dotProp.set(
      collaborators,
      `${index}.expiresAt`,
      momentDate
    );
    form.setFieldsValue({ collaborators });
  };

  render() {
    const { form } = this.props;
    form.getFieldDecorator("collaborators", {
      initialValue: [],
      rules: [
        {
          type: "array",
          required: true,
          message: "collaborators are required"
        }
      ]
    });

    const collaborators = form.getFieldValue("collaborators");
    const error = form.getFieldError("collaborators");
    const dateFormat = "MMM DD, YYYY";

    return (
      <div>
        {collaborators.map((c, index) => {
          return (
            <div key={index}>
              <Row gutter={16}>
                <Col span={20}>
                  <Form.Item
                    label="Email address"
                    help={
                      <span style={{ color: "red" }}>
                        {this.getError(index, "email")}
                      </span>
                    }
                    style={{ marginBottom: "4px" }}
                  >
                    <Input
                      value={c.email}
                      onChange={event => {
                        this.onUpdateEmail(index, event.target.value);
                      }}
                      autoComplete="email"
                    />
                  </Form.Item>
                  <Form.Item
                    label="Message"
                    help={
                      <span style={{ color: "red" }}>
                        {this.getError(index, "message")}
                      </span>
                    }
                  >
                    <Input.TextArea
                      autosize
                      autoComplete="off"
                      value={c.message}
                      onChange={event => {
                        this.onUpdateMessage(index, event.target.value);
                      }}
                    />
                  </Form.Item>
                  <Form.Item
                    label="Expires at"
                    help={
                      <span style={{ color: "red" }}>
                        {this.getError(index, "expiresAt")}
                      </span>
                    }
                  >
                    <DatePicker
                      format={dateFormat}
                      disabledDate={current => {
                        return (
                          current &&
                          current <
                            moment()
                              .subtract(1, "day")
                              .endOf("day")
                        );
                      }}
                      onChange={(...args) => {
                        this.onUpdateExpiresAt(index, ...args);
                      }}
                      value={c.expiresAt && moment(c.expiresAt, dateFormat)}
                    />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Button
                    icon="close"
                    onClick={() => this.onDeleteField(index)}
                    type="danger"
                  />
                </Col>
              </Row>
              {index !== collaborators.length - 1 && <Divider />}
            </div>
          );
        })}
        <span style={{ color: "red" }}>{error}</span>
        <Button block icon="plus" onClick={this.onAddField}>
          Add Collaborator
        </Button>
      </div>
    );
  }
}
