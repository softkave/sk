import React from "react";
import ComputeForm from "../compute-form/ComputeForm.jsx";
import { Input, Button, Form } from "antd";
import { orgDescriptor as blockDescriptor } from "../../models/block/descriptor";
import { makeNameExistsValidator } from "../../utils/descriptor";
import modalWrap from "../modalWrap.jsx";
import Roles from "../role/Roles.jsx";
import Acl from "../acl/Acl.jsx";
import {
  generateACL,
  generateRolesActions,
  generateBlockPermission,
  generateACLArrayFromObj,
  blockActionTypes
} from "../../models/acl";
import { getDefaultRolesArr } from "../../models/roles";
import { orgActions } from "../../models/actions";

const TextArea = Input.TextArea;

class EditOrg extends React.Component {
  static defaultProps = {
    data: {}
  };

  constructor(props) {
    super(props);
    const self = this;
    const data = props.data || {};
    const defaultRoles = getDefaultRolesArr();
    // const actions = generateACL(blockActionTypes);
    // const defaultAcl = generateBlockPermission({ acl: actions });
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
                props.existingOrgs,
                "orgs exist"
              )
            }
          ],
          initialValue: data.name
        },
        description: {
          component: TextArea,
          props: { autosize: { minRows: 2, maxRows: 6 } },
          label: "Description",
          // labelCol: null,
          // wrapperCol: null,
          rules: blockDescriptor.description,
          initialValue: data.description
        },
        // roles: {
        //   render(form, data) {
        //     return (
        //       <Form.Item key="roles" label="Roles">
        //         <Roles form={form} roles={defaultRoles} />
        //       </Form.Item>
        //     );
        //   }
        // },
        acl: {
          render(form, data) {
            return (
              <Form.Item key="acl" label="Access Control">
                <Acl
                  form={form}
                  defaultAcl={data.acl || orgActions}
                  roles={data.roles || defaultRoles}
                />
              </Form.Item>
            );
          }
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

  onSubmit = data => {
    data.type = "org";
    this.props.onSubmit(data);
  };

  render() {
    return <ComputeForm model={this.model} form={this.props.form} />;
  }
}

export default modalWrap(Form.create()(EditOrg), "Org");
