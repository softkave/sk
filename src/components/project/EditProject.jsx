import React from "react";
import ComputeForm from "../compute-form/ComputeForm.jsx";
import { Input, Button, Form } from "antd";
import { projectDescriptor as blockDescriptor } from "../../models/block/descriptor";
import Empty from "../Empty.jsx";
import { makeNameExistsValidator } from "../../utils/descriptor";
import modalWrap from "../modalWrap.jsx";

const TextArea = Input.TextArea;

class EditProject extends React.Component {
  static defaultProps = {
    data: {}
  };

  constructor(props) {
    super(props);
    console.log(props);
    const self = this;
    const data = props.data || {};
    this.model = {
      fields: {
        error: {
          component: Empty
        },
        name: {
          component: Input,
          props: { autoComplete: "off" },
          label: "Name",
          labelCol: null,
          wrapperCol: null,
          rules: [
            ...blockDescriptor.name,
            {
              validator: makeNameExistsValidator(
                props.existingProjects,
                "project exists"
              )
            }
          ],
          initialValue: data.name
        },
        description: {
          component: TextArea,
          props: { autosize: true },
          label: "Description",
          labelCol: null,
          wrapperCol: null,
          rules: blockDescriptor.description,
          initialValue: data.description
        },
        // acl
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

  onSubmit = data => {
    data.type = "project";
    this.props.onSubmit(data);
  };

  render() {
    return <ComputeForm model={this.model} form={this.props.form} />;
  }
}

export default modalWrap(Form.create()(EditProject));
