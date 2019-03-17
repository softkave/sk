import React from "react";
import { Form, Collapse, Select } from "antd";
import dotProp from "dot-prop-immutable";

const Panel = Collapse.Panel;

export default class Acl extends React.Component {
  // shouldComponentUpdate(nextProps) {
  //   if (nextProps.acl === this.props.acl) {
  //     return false;
  //   }
  // }

  onUpdateAcl = (index, roles) => {
    const { form } = this.props;
    const acl = form.getFieldValue("acl");
    let updatedAcl = dotProp.set(acl, `${index}.roles`, roles);
    form.setFieldsValue({ acl: updatedAcl });
  };

  render() {
    const { defaultAcl, form, roles } = this.props;
    form.getFieldDecorator("acl", {
      initialValue: defaultAcl
    });

    const acl = form.getFieldValue("acl");
    console.log(acl);

    return (
      <Collapse>
        <Panel header="Actions">
          {acl.map((item, index) => {
            return (
              <Form.Item
                key={item.action}
                label={item.action}
                // labelCol={{
                //   span: 8
                // }}
                // wrapperCol={{ span: 16 }}
              >
                <Select
                  mode="multiple"
                  onChange={value => this.onUpdateAcl(index, value)}
                  defaultValue={acl.roles}
                >
                  {roles.map(role => {
                    return <Select.Option value={role}>{role}</Select.Option>;
                  })}
                </Select>
              </Form.Item>
            );
          })}
        </Panel>
      </Collapse>
    );
  }
}
