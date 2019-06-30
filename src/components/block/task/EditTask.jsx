import React from "react";
import { Input, Button, DatePicker, Form, Spin } from "antd";

import { taskDescriptor as blockDescriptor } from "../../../models/block/descriptor";
import modalWrap from "../../modalWrap.jsx";
import AssignTask from "./AssignTask.jsx";
import FormError from "../../FormError.jsx";
import { constructSubmitHandler } from "../../form-utils.js";
import EditPriority from "./EditPriority.jsx";

class EditTask extends React.Component {
  static defaultProps = {
    data: {},
    submitLabel: "Create Task"
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
      proccess: data => {
        data.type = "task";
        return data;
      },
      beforeProcess: () => this.setState({ isLoading: true, error: null }),
      afterErrorProcess: indexedErrors => {
        if (Array.isArray(indexedErrors.error)) {
          this.setState({ error: indexedErrors.error[0].message });
        }
      },
      completedProcess: () => this.setState({ isLoading: false })
    });
  };

  render() {
    const {
      form,
      data,
      collaborators,
      defaultAssignedTo,
      user,
      submitLabel
    } = this.props;
    const { isLoading, error } = this.state;
    const onSubmit = this.getSubmitHandler();

    return (
      <Spin spinning={isLoading}>
        <Form hideRequiredMark onSubmit={onSubmit}>
          {error && <FormError>{error}</FormError>}
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
          <Form.Item label="Priority">
            {form.getFieldDecorator("priority", {
              initialValue: data.priority || "not important"
            })(<EditPriority />)}
          </Form.Item>
          <Form.Item label="Collaborators">
            {form.getFieldDecorator("taskCollaborators", {
              initialValue: data.taskCollaborators || defaultAssignedTo,
              getValueFromEvent: data => data
            })(<AssignTask collaborators={collaborators} user={user} />)}
          </Form.Item>
          <Form.Item label="Should Complete At">
            {form.getFieldDecorator("expectedEndAt", {
              initialValue: data.expectedEndAt
            })(
              <DatePicker
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                placeholder=" Should Complete At"
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

export default modalWrap(Form.create()(EditTask), "Task");
