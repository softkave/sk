import React from "react";
import EditPriority from "./EditPriority.jsx";
import ComputeForm from "../compute-form/ComputeForm.jsx";
import { Input, Button, Checkbox, DatePicker, Form } from "antd";
import { blockDescriptor } from "../../models/block/descriptor";
import Empty from "../Empty.jsx";

const TextArea = Input.TextArea;

class EditTask extends React.Component {
  constructor(props) {
    super(props);
    this.model = {
      fields: {
        error: {
          component: Empty
        },
        description: {
          component: TextArea,
          props: { autosize: true },
          label: "Description",
          labelCol: null,
          wrapperCol: null,
          rules: blockDescriptor.description
        },
        priority: {
          component: EditPriority,
          props: {},
          label: "Priority",
          labelCol: null,
          wrapperCol: null
        },
        // collaborators
        completeAt: {
          component: DatePicker,
          props: {
            showTime: true,
            format: "YYYY-MM-DD HH:mm:ss",
            placeholder: "Complete At"
          },
          label: "Complete At",
          labelCol: null,
          wrapperCol: null
        },
        submit: {
          component: Button,
          props: {
            type: "primary",
            children: "Submit",
            block: "true",
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
      onSubmit: this.onSubmit
    };
  }

  onSubmit = data => {};

  render() {
    return <ComputeForm model={this.model} form={this.props.form} />;
  }
}

export default Form.create()(EditTask);
