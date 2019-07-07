import React from "react";
import { Input, Button, DatePicker, Form, Spin, List, Select } from "antd";
import moment from "moment";

import { taskDescriptor as blockDescriptor } from "../../../models/block/descriptor";
import modalWrap from "../../modalWrap.jsx";
import FormError from "../../FormError.jsx";
import { constructSubmitHandler } from "../../form-utils.js";
import EditPriority from "./EditPriority.jsx";
import { blockErrorFields } from "../../../models/block/blockErrorMessages";
import { serverErrorFields } from "../../../models/serverErrorMessages";
import { indexArray } from "../../../utils/object";
import TaskCollaboratorThumbnail from "./TaskCollaboratorThumbnail";
import CollaboratorThumbnail from "../../collaborator/Thumnail";

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

    this.indexedCollaborators = indexArray(props.collaborators, {
      path: "customId"
    });
  }

  getSubmitHandler = () => {
    const { form, onSubmit } = this.props;

    return constructSubmitHandler({
      form,
      submitCallback: onSubmit,
      process: data => {
        data.type = "task";
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

  onAssignCollaborator = collaborator => {
    const { user, form } = this.props;
    const value = form.getFieldValue("taskCollaborators") || [];
    const collaboratorExists = !!value.find(next => {
      return collaborator.customId === next.userId;
    });

    if (!collaboratorExists) {
      value.push({
        userId: collaborator.customId,
        assignedAt: Date.now(),
        completedAt: 0,
        assignedBy: user.customId
      });

      form.setFieldsValue({ taskCollaborators: value });
    }
  };

  onUnassignCollaborator = collaborator => {
    const { form } = this.props;
    const value = form.getFieldValue("taskCollaborators") || [];
    const index = value.findIndex(next => {
      return next.userId === collaborator.userId;
    });

    if (index !== -1) {
      value.splice(index, 1);
      form.setFieldsValue({ taskCollaborators: value });
    }
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
    const formValue = form.getFieldsValue();

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
          <Form.Item label="Assigned To">
            <List
              dataSource={
                formValue.taskCollaborators ||
                data.taskCollaborators ||
                defaultAssignedTo
              }
              renderItem={item => {
                return (
                  <List.Item>
                    <TaskCollaboratorThumbnail
                      key={item.userId}
                      collaborator={this.indexedCollaborators[item.userId]}
                      taskCollaborator={item}
                      onToggle={null}
                      onUnassign={() => this.onUnassignCollaborator(item)}
                    />
                  </List.Item>
                );
              }}
            />
          </Form.Item>
          <Form.Item>
            <Select
              placeholder="Assign Collaborator"
              value={undefined}
              onChange={index => {
                this.onAssignCollaborator(collaborators[index]);
              }}
            >
              {collaborators.map((collaborator, index) => {
                return (
                  <Select.Option value={index} key={collaborator.customId}>
                    <CollaboratorThumbnail collaborator={collaborator} />
                  </Select.Option>
                );
              })}
            </Select>
            <Button block onClick={() => this.onAssignCollaborator(user)}>
              Assign To Me
            </Button>
          </Form.Item>
          <Form.Item label="Select Collaborators">
            {form.getFieldDecorator("taskCollaborators", {
              initialValue: data.taskCollaborators || defaultAssignedTo
            })(<span />)}
          </Form.Item>

          <Form.Item label="Should Complete At">
            {form.getFieldDecorator("expectedEndAt", {
              initialValue: data.expectedEndAt
                ? moment(data.expectedEndAt)
                : null
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
