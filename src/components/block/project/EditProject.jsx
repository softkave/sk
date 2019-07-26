import React from "react";
import { Input, Button, Form } from "antd";

import { projectDescriptor as blockDescriptor } from "../../../models/block/descriptor";
import { makeNameExistsValidator } from "../../../utils/descriptor";
import modalWrap from "../../modalWrap.jsx";
import { constructSubmitHandler } from "../../form-utils.js";
import { blockErrorFields } from "../../../models/block/blockErrorMessages";
import { serverErrorFields } from "../../../models/serverErrorMessages";
import { NewFormAntD } from "../../NewFormAntD";

const projectExistsErrorMessage = "Project with the same name exists";

class EditProject extends React.Component {
  static defaultProps = {
    data: {},
    submitLabel: "Create Project"
  };

  getSubmitHandler = () => {
    const { form, onSubmit } = this.props;

    return constructSubmitHandler({
      form,
      submitCallback: onSubmit,
      process: data => {
        data.type = "project";
        return { values: data, hasError: false };
      },
      beforeProcess: () => this.setState({ isLoading: true, error: null }),
      afterErrorProcess: indexedErrors => {
        if (Array.isArray(indexedErrors.error) && indexedErrors.error[0]) {
          this.setState({
            error: indexedErrors.error[0].message,
            isLoading: false
          });
        }
      },
      // completedProcess: () => this.setState({ isLoading: false }),
      transformErrorMap: [
        {
          field: blockErrorFields.orgExists,
          toField: "name"
        },
        {
          field: serverErrorFields.serverError,
          toField: "error"
        }
      ]
    });
  };

  render() {
    const { form, data, submitLabel, existingProjects } = this.props;

    return (
      <NewFormAntD>
        <Form.Item label="Project Name">
          {form.getFieldDecorator("name", {
            rules: [
              ...blockDescriptor.name,
              {
                validator: makeNameExistsValidator(
                  existingProjects,
                  projectExistsErrorMessage
                )
              }
            ],
            initialValue: data.name
          })(<Input autoComplete="off" />)}
        </Form.Item>
        <Form.Item label="Description">
          {form.getFieldDecorator("description", {
            rules: blockDescriptor.description,
            initialValue: data.description
          })(
            <Input.TextArea
              autosize={{ minRows: 2, maxRows: 6 }}
              autoComplete="off"
            />
          )}
        </Form.Item>
        <Form.Item>
          <Button block type="primary" htmlType="submit">
            {submitLabel}
          </Button>
        </Form.Item>
      </NewFormAntD>
    );
  }
}

export default modalWrap(Form.create()(EditProject), "Project");
