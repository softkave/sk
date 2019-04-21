import React from "react";
import { Form, Collapse, Select } from "antd";
import dotProp from "dot-prop-immutable";

const Panel = Collapse.Panel;

export default class Acl extends React.Component {
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

    return (
      <Collapse>
        <Panel header="Actions">
          {acl.map((item, index) => {
            return (
              <Form.Item
                label={
                  <span style={{ textTransform: "lowercase" }}>
                    {item.action.replace("_", " ")}
                  </span>
                }
                key={item.action}
                // labelCol={{
                //   span: 8
                // }}
                // wrapperCol={{ span: 16 }}
              >
                <Select
                  mode="multiple"
                  onChange={value => this.onUpdateAcl(index, value)}
                  defaultValue={item.roles}
                >
                  {roles.map(role => {
                    return (
                      <Select.Option key={role.role} value={role.role}>
                        {role.role}
                      </Select.Option>
                    );
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
