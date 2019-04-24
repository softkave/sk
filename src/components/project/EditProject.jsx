import React from "react";
import ComputeForm from "../compute-form/ComputeForm.jsx";
import { Input, Button, Form } from "antd";
import { projectDescriptor as blockDescriptor } from "../../models/block/descriptor";
import { makeNameExistsValidator } from "../../utils/descriptor";
import modalWrap from "../modalWrap.jsx";
import Acl from "../acl/Acl.jsx";
import {
  generateBlockPermission,
  generateACLArrayFromObj,
  canPerformAction
} from "../../models/block/acl";

const TextArea = Input.TextArea;

class EditProject extends React.Component {
  static defaultProps = {
    data: {}
  };

  constructor(props) {
    super(props);
    const self = this;
    const data = props.data || {};

    this.model = {
      fields: {
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
          props: { autosize: { minRows: 2, maxRows: 6 } },
          label: "Description",
          labelCol: null,
          wrapperCol: null,
          rules: blockDescriptor.description,
          initialValue: data.description
        },
        acl:
          !props.data || canPerformAction(data, props.permission, "UPDATE_ACL")
            ? {
                render(form, data) {
                  return props.noAcl ? null : (
                    <Form.Item key="acl" label="Access Control">
                      <Acl
                        form={form}
                        defaultAcl={data.acl || props.defaultAcl}
                        roles={data.roles || props.roles}
                      />
                    </Form.Item>
                  );
                }
              }
            : undefined,
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
    return this.props.onSubmit(data);
  };

  render() {
    return <ComputeForm model={this.model} form={this.props.form} />;
  }
}

export default modalWrap(Form.create()(EditProject), "Project");
