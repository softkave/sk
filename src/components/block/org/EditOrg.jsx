import React from "react";
import { Input, Button, Form, Spin } from "antd";

import { orgDescriptor as blockDescriptor } from "../../../models/block/descriptor";
import modalWrap from "../../modalWrap.jsx";
import FormError from "../../FormError.jsx";
import { constructSubmitHandler } from "../../form-utils.js";
import { blockErrorFields } from "../../../models/block/blockErrorMessages";
import { serverErrorFields } from "../../../models/serverErrorMessages";

class EditOrg extends React.Component {
  static defaultProps = {
    data: {},
    submitLabel: "Create Organization"
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
        console.log(data);
        data.type = "org";
        console.log(data);
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
    const { form, data, submitLabel } = this.props;
    const { isLoading, error } = this.state;
    const onSubmit = this.getSubmitHandler();

    return (
      <Spin spinning={isLoading}>
        <Form hideRequiredMark onSubmit={onSubmit}>
          {error && <FormError>{error}</FormError>}
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
        </Form>
      </Spin>
    );
  }
}

export default modalWrap(Form.create()(EditOrg), "Org");
