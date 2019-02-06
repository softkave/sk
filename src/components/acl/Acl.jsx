import React from "react";
import { Form, Collapse } from "antd";
import SelectRole from "./SelectRole.jsx";
import dotProp from "dot-prop-immutable";

const Panel = Collapse.Panel;

export default class Acl extends React.Component {
  // shouldComponentUpdate(nextProps) {
  //   if (nextProps.acl === this.props.acl) {
  //     return false;
  //   }
  // }

  onUpdateAcl = (resourceType, action, level) => {
    console.log(resourceType, action, level);
    const { form } = this.props;
    let acl = form.getFieldValue("acl");
    acl = dotProp.set(acl, `${resourceType}.${action}.level`, level);
    form.setFieldsValue({ acl });
  };

  render() {
    const { defaultAcl, form } = this.props;
    const ownerRoles = this.props.roles;
    const roles = form.getFieldValue("roles") || ownerRoles;
    form.getFieldDecorator("acl", {
      initialValue: defaultAcl
    });

    const acl = form.getFieldValue("acl");
    console.log(acl);

    return (
      <Collapse>
        {Object.keys(acl).map(resourceType => {
          const actions = acl[resourceType];
          return (
            <Panel header={resourceType} key={resourceType}>
              {Object.keys(actions).map(action => {
                const actionData = actions[action];
                return (
                  <Form.Item
                    key={action}
                    label={action}
                    // labelCol={{
                    //   span: 8
                    // }}
                    // wrapperCol={{ span: 16 }}
                  >
                    <SelectRole
                      roles={roles}
                      value={actionData.level}
                      onChange={roleLevel => {
                        console.log(roleLevel);
                        this.onUpdateAcl(resourceType, action, roleLevel);
                      }}
                    />
                  </Form.Item>
                );
              })}
            </Panel>
          );
        })}
      </Collapse>
    );
  }
}
