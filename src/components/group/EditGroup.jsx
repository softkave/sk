import React from "react";
import ComputeForm from "../compute-form/ComputeForm.jsx";
import { Input, Button, Form } from "antd";
import { groupDescriptor as blockDescriptor } from "../../models/block/descriptor";
import { makeNameExistsValidator } from "../../utils/descriptor";
import modalWrap from "../modalWrap.jsx";
import Acl from "../acl/Acl.jsx";
<<<<<<< HEAD
import { canPerformAction } from "../../models/acl";
=======
import { canPerformAction } from "../../models/block/acl";
>>>>>>> cb76368d304ef130b5864922dd098d1785bda3cf

const TextArea = Input.TextArea;

class EditGroup extends React.Component {
  static defaultProps = {
    data: {}
  };

  constructor(props) {
    super(props);
    const data = props.data || {};
    const self = this;
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
                props.existingGroups,
                "group exists"
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
    data.type = "group";
    return this.props.onSubmit(data);
  };

  render() {
    return <ComputeForm model={this.model} form={this.props.form} />;
  }
}

export default modalWrap(Form.create()(EditGroup), "Group");
