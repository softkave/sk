import React from "react";
import { Input, Button, Form, Spin } from "antd";

import { groupDescriptor as blockDescriptor } from "../../../models/block/descriptor";
import { makeNameExistsValidator } from "../../../utils/descriptor";
import modalWrap from "../../modalWrap.jsx";
import FormError from "../../FormError.jsx";
import { constructSubmitHandler } from "../../form-utils.js";
import { serverErrorFields } from "../../../models/serverErrorMessages";
import { blockErrorFields } from "../../../models/block/blockErrorMessages";

const groupExistsErrorMessage = "Group with the same name exists";

class EditGroup extends React.Component {
  static defaultProps = {
    data: {},
    submitLabel: "Create Group"
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      error: null
    };
  }

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
    const { isLoading, error } = this.state;
    const onSubmit = this.getSubmitHandler();

    return (
      <Spin spinning={isLoading}>
        <Form hideRequiredMark onSubmit={onSubmit}>
          {error && <FormError>{error}</FormError>}
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
        </Form>
      </Spin>
    );
  }
}

export default modalWrap(Form.create()(EditGroup), "Group");
