import React from "react";
import { Input, Button, Form } from "antd";

import { orgDescriptor as blockDescriptor } from "../../../models/block/descriptor";
import modalWrap from "../../modalWrap.jsx";
import { constructSubmitHandler } from "../../form-utils.js";
import { blockErrorFields } from "../../../models/block/blockErrorMessages";
import { serverErrorFields } from "../../../models/serverErrorMessages";
import { NewFormAntD } from "../../NewFormAntD";

class EditOrg extends React.Component {
  static defaultProps = {
    data: {},
    submitLabel: "Create Organization"
  };

  getSubmitHandler = () => {
    const { form, onSubmit } = this.props;

    return constructSubmitHandler({
      form,
      submitCallback: onSubmit,
      process: data => {
        data.type = "org";
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
    const { form, data, submitLabel } = this.props;

    return (
      <NewFormAntD>
        <Form.Item label="Organization Name">
          {form.getFieldDecorator("name", {
            rules: [...blockDescriptor.name],
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

export default modalWrap(Form.create()(EditOrg), "Org");
