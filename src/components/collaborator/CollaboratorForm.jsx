import React from "react";
import { Select, Input, Form, Button, Divider, Row, Col } from "antd";
import dotProp from "dot-prop-immutable";
import asyncValidator from "async-validator";

function promisifyAsyncValidator(v) {
  return function(data) {
    return new Promise(function(success, reject) {
      v(data, function(errors, fields) {
        if (errors) {
          reject({ errors, fields });
        } else {
          success(fields);
        }
      });
    });
  };
}

function waitForPromises(promises) {
  return new Promise(function(resolve, reject) {
    function reportPromise(p) {
      p.then(data => {
        result.push({ data, success: true });
        nextPromise();
      }).catch(error => {
        result.push({ error, failed: true });
        nextPromise();
      });
    }

    function nextPromise() {
      if (index === promises.length) {
        resolve(result);
      } else {
        let p = promises[index];
        index += 1;
        reportPromise(p);
      }
    }

    let result = [];
    let index = 0;
    nextPromise();
  });
}

export default class CollaboratorForm extends React.Component {
  constructor(props) {
    super(props);
    this.editingIndex = null;
    this.errors = {};
    const emailDescriptor = [
      { type: "email", required: true }
      // {
      //   validator: (rule, value, cb) => {
      //     value = value.toLowerCase();
      //     let existingReq = props.form
      //       .getFieldValue("collaborators")
      //       .find((c, index) => {
      //         if (
      //           index !== this.editingIndex &&
      //           value === c.email.toLowerCase()
      //         ) {
      //           return true;
      //         }

      //         return false;
      //       });

      //     if (existingReq) {
      //       cb("email has been entered already");
      //     } else {
      //       cb();
      //     }
      //   }
      // }
    ];

    const roleDescriptor = [
      {
        type: "object",
        required: true
        // options: { single: true, first: true },
        // fields: {
        //   label: { type: "string" },
        //   level: { type: "number" }
        // }
      }
    ];

    const descriptor = {
      email: emailDescriptor,
      role: roleDescriptor
    };

    this.validateCollaborator = new asyncValidator(descriptor);
    this.emailValidator = new asyncValidator({ email: emailDescriptor });
    this.roleValidator = new asyncValidator({ role: roleDescriptor });
    this.pEmailValidator = promisifyAsyncValidator(
      this.emailValidator.validate.bind(this.emailValidator)
    );

    this.pRoleValidator = promisifyAsyncValidator(
      this.roleValidator.validate.bind(this.roleValidator)
    );

    this.pValidator = promisifyAsyncValidator(
      this.validateCollaborator.validate.bind(this.validateCollaborator)
    );
  }

  componentDidMount() {
    if (this.props.getHelpers) {
      this.props.getHelpers({ validate: this.validate });
    }
  }

  componentWillUnmount() {
    if (this.props.clearHelpers) {
      this.props.clearHelpers();
    }
  }

  clearHelpers = (index, type) => {
    this.editingIndex = null;
    console.log(index, type);
    if (type) {
      if (this.errors[index]) {
        this.errors[index][type] = null;
        console.log(this.errors[index]);
      }
    } else {
      delete this.errors[index];
    }
  };

  clearErrors = () => {
    this.errors = {};
  };

  setError = (index, emailError, roleError) => {
    this.errors[index] = { email: emailError, role: roleError };
  };

  hasError = () => {
    return !!Object.keys(this.errors).length;
  };

  getError = (index, type = "email") => {
    return dotProp.get(this.errors, `${index}.${type}`);
  };

  validate = cb => {
    const { form } = this.props;
    let collaborators = form.getFieldValue("collaborators");
    let validationPromises = [];
    collaborators.forEach((c, index) => {
      validationPromises.push(this.pValidator(c));
    });

    waitForPromises(validationPromises).then(result => {
      result.forEach((r, index) => {
        if (r.failed) {
          this.setError(
            index,
            dotProp.get(r.error.fields, `email.0.message`),
            dotProp.get(r.error.fields, `role.0.message`)
          );
        }
      });

      const hasError = this.hasError();
      if (hasError) {
        form.setFieldsValue({ collaborators });
      }

      cb(null, true);
    });
  };

  onAddField = () => {
    const { form } = this.props;
    let collaborators = form.getFieldValue("collaborators");
    collaborators = collaborators.concat([{ email: "", role: null }]);
    this.editingIndex = collaborators.length - 1;
    form.setFieldsValue({ collaborators });
  };

  onDeleteField = index => {
    const { form } = this.props;
    let collaborators = form.getFieldValue("collaborators");
    collaborators = dotProp.delete(collaborators, index);
    this.clearHelpers(index);
    form.setFieldsValue({ collaborators });
  };

  onUpdateEmail = (index, email) => {
    const { form } = this.props;
    let collaborators = form.getFieldValue("collaborators");
    this.emailValidator.validate({ email }, errors => {
      console.log(errors, email);
      if (errors) {
        console.log("setting email error");
        this.setError(index, errors[0].message);
      } else {
        console.log("clearing email error");
        this.clearHelpers(index, "email");
      }

      collaborators = dotProp.set(collaborators, `${index}.email`, email);
      this.editingIndex = index;
      console.log(this.errors);
      form.setFieldsValue({ collaborators });
    });
  };

  onUpdateRole = (index, roleLabel) => {
    const { form, roles } = this.props;
    let collaborators = form.getFieldValue("collaborators");
    const role = roles.find(r => r.label === roleLabel);
    collaborators = dotProp.set(collaborators, `${index}.role`, role);
    this.clearHelpers(index, "role");
    form.setFieldsValue({ collaborators });
  };

  render() {
    const { form, roles } = this.props;
    form.getFieldDecorator("collaborators", {
      initialValue: [],
      rules: [
        {
          type: "array",
          required: true
        }
      ]
    });

    const collaborators = form.getFieldValue("collaborators");
    const error = form.getFieldError("collaborators");

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
                    label="Role"
                    help={
                      <span style={{ color: "red" }}>
                        {this.getError(index, "role")}
                      </span>
                    }
                  >
                    <Select
                      placeholder="Select a role"
                      value={c.role ? c.role.label : null}
                      onChange={roleLabel =>
                        this.onUpdateRole(index, roleLabel)
                      }
                    >
                      {roles.map((r, index) => {
                        return (
                          <Select.Option key={r.label} value={r.label}>
                            {r.label}
                          </Select.Option>
                        );
                      })}
                    </Select>
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
