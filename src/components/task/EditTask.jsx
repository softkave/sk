import React from "react";
import EditPriority from "./EditPriority.jsx";
import ComputeForm from "../compute-form/ComputeForm.jsx";
import { Input, Button, DatePicker, Form } from "antd";
import { taskDescriptor as blockDescriptor } from "../../models/block/descriptor";
import modalWrap from "../modalWrap.jsx";
import AssignTask from "./AssignTask.jsx";

const TextArea = Input.TextArea;

class EditTask extends React.Component {
  static defaultProps = {
    data: {}
  };

  constructor(props) {
    super(props);
    const self = this;
    const data = props.data || {};
    // const priorityPath = `data[${
    //   data.data ? data.data.findIndex(d => d.dataType === "priority") : 0
    // }].data`;

    this.model = {
      fields: {
        description: {
          component: TextArea,
          props: { autosize: { minRows: 3, maxRows: 7 } },
          label: "Description",
          labelCol: null,
          wrapperCol: null,
          rules: blockDescriptor.description,
          initialValue: data.description
        },
        priority: {
          component: EditPriority,
          props: {},
          label: "Priority",
          labelCol: null,
          wrapperCol: null,
          initialValue: data.data
            ? data.data.find(d => d.dataType === "priority")
            : "not important"
        },
        collaborators: {
          render(form) {
            return (
              <Form.Item label="Collaborators" key="collaborators">
                <AssignTask
                  key="assignTasks"
                  form={form}
                  collaborators={props.collaborators}
                  defaultTaskCollaborators={
                    data.collaborators || props.autoAssignTo
                  }
                  user={props.user}
                />
              </Form.Item>
            );
          }
        },
        completeAt: {
          component: DatePicker,
          props: {
            showTime: true,
            format: "YYYY-MM-DD HH:mm:ss",
            placeholder: "Complete At"
          },
          label: "Complete At",
          labelCol: null,
          wrapperCol: null,
          initialValue: data.completeAt
        },
        submit: {
          component: Button,
          props: {
            type: "primary",
            children: "Submit",
            block: true,
            htmlType: "submit"
          },
          labelCol: null,
          wrapperCol: null,
          noDecorate: true
        }
      },
      formProps: {
        hideRequiredMark: true
      },
      onSubmit: self.onSubmit
    };
  }

  onSubmit = submittedData => {
    // const { data } = this.props;
    // delete submittedData.error;
    // submittedData.data = data && data.data ? [...data.data] : null;
    // if (submittedData.data) {
    //   let priorityData = submittedData.data.find(
    //     d => d.dataType === "priority"
    //   );

    //   if (priorityData) {
    //     priorityData.data = submittedData.priority;
    //   } else {
    //     submittedData.data.push({
    //       dataType: "priority",
    //       data: submittedData.priority
    //     });
    //   }
    // } else {
    //   submittedData.data = [
    //     { dataType: "priority", data: submittedData.priority }
    //   ];
    // }

    // delete submittedData.priority;
    submittedData.type = "task";
    this.props.onSubmit(submittedData);
  };

  render() {
    return <ComputeForm model={this.model} form={this.props.form} />;
  }
}

export default modalWrap(Form.create()(EditTask), "Task");
