import React from "react";
import ComputeForm from "../compute-form/ComputeForm.jsx";
import { Input, Button, Checkbox, Form } from "antd";
import { blockDescriptor } from "../../models/block/descriptor";
import Empty from "../Empty.jsx";
import { makeNameExistsValidator } from "../../utils/descriptor";

const TextArea = Input.TextArea;

class EditProject extends React.Component {
  model = {
    fields: {
      error: {
        component: Empty
      },
      name: {
        component: Input,
        props: { autocomplete: "off" },
        label: "Name",
        labelCol: null,
        wrapperCol: null,
        rules: [
          ...blockDescriptor.name,
          { validator: makeNameExistsValidator(this.props.existingProjects) }
        ],
        initialValue: this.props.data.name
      },
      description: {
        component: TextArea,
        props: { autosize: true },
        label: "Description",
        labelCol: null,
        wrapperCol: null,
        rules: blockDescriptor.description,
        initialValue: this.props.data.description
      },
      // acl
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

  onSubmit = data => {};

  render() {
    return <ComputeForm model={this.model} form={this.props.form} />;
  }
}

export default Form.create()(EditProject);
