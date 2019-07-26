import React from "react";
import { Input, Button, Form } from "antd";

import { groupDescriptor as blockDescriptor } from "../../../models/block/descriptor";
import { makeNameExistsValidator } from "../../../utils/descriptor";
import modalWrap from "../../modalWrap.jsx";
import { constructSubmitHandler } from "../../form-utils.js";
import { serverErrorFields } from "../../../models/serverErrorMessages";
import { blockErrorFields } from "../../../models/block/blockErrorMessages";
import { NewFormAntD } from "../../NewFormAntD";

const groupExistsErrorMessage = "Group with the same name exists";

class EditGroup extends React.Component {
  static defaultProps = {
    data: {},
    submitLabel: "Create Group"
  };

  getSubmitHandler = () => {
    const { form, onSubmit } = this.props;

    return constructSubmitHandler({
      form,
      submitCallback: onSubmit,
      process: data => {
        data.type = "group";
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
          field: serverErrorFields.serverError,
          toField: "error"
        },
        {
          field: blockErrorFields.groupExists,
          toField: "name"
        }
      ]
    });
  };

  render() {
    const { form, data, submitLabel, existingGroups } = this.props;

    return (
      <NewFormAntD>
        <Form.Item label="Group Name">
          {form.getFieldDecorator("name", {
            rules: [
              ...blockDescriptor.name,
              {
                validator: makeNameExistsValidator(
                  existingGroups,
                  groupExistsErrorMessage
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

export default modalWrap(Form.create()(EditGroup), "Group");
