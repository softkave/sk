import React from "react";
import EditPriority from "./EditPriority.jsx";
import ComputeForm from "../../compute-form/ComputeForm.jsx";
import { Input, Button, DatePicker, Form, Spin } from "antd";
import { taskDescriptor as blockDescriptor } from "../../../models/block/descriptor";
import modalWrap from "../../modalWrap.jsx";
import AssignTask from "./AssignTask.jsx";
import FormError from "../../FormError.jsx";
import { constructSubmitHandler } from "../../form-utils.js";

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

    // const self = this;
    // const data = props.data || {};

    // this.model = {
    //   fields: {
    //     description: {
    //       component: TextArea,
    //       props: { autosize: { minRows: 2, maxRows: 6 } },
    //       label: "Description",
    //       labelCol: null,
    //       wrapperCol: null,
    //       rules: blockDescriptor.description,
    //       initialValue: data.description
    //     },
    //     priority: {
    //       component: EditPriority,
    //       props: {},
    //       label: "Priority",
    //       labelCol: null,
    //       wrapperCol: null,
    //       initialValue: data.data
    //         ? data.data.find(d => d.dataType === "priority")
    //         : "not important"
    //     },
    //     taskCollaborators: {
    //       render(form) {
    //         return (
    //           <Form.Item label="Collaborators" key="taskCollaborators">
    //             <AssignTask
    //               key="assignTasks"
    //               form={form}
    //               collaborators={props.collaborators}
    //               defaultTaskCollaborators={
    //                 data.taskCollaborators || props.defaultAssignedTo
    //               }
    //               user={props.user}
    //             />
    //           </Form.Item>
    //         );
    //       }
    //     },
    //     expectedEndAt: {
    //       component: DatePicker,
    //       props: {
    //         showTime: true,
    //         format: "YYYY-MM-DD HH:mm:ss",
    //         placeholder: "Complete At"
    //       },
    //       label: "Complete At",
    //       labelCol: null,
    //       wrapperCol: null,
    //       initialValue: data.completeAt
    //     },
    //     submit: {
    //       component: Button,
    //       props: {
    //         type: "primary",
    //         children: "Submit",
    //         block: true,
    //         htmlType: "submit"
    //       },
    //       labelCol: null,
    //       wrapperCol: null,
    //       noDecorate: true
    //     }
    //   },
    //   formProps: {
    //     hideRequiredMark: true
    //   },
    //   onSubmit: self.onSubmit
    // };
  }

  // onSubmit = submittedData => {
  //   submittedData.type = "task";
  //   return this.props.onSubmit(submittedData);
  // };

  // render() {
  //   return <ComputeForm model={this.model} form={this.props.form} />;
  // }

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
