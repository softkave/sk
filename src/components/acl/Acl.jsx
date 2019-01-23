import React from "react";
import { Form, Collapse, Select } from "antd";

const Panel = Collapse.Panel;

export default class Acl extends React.Component {
  shouldComponentUpdate(nextProps) {
    if (nextProps.acl === this.props.acl) {
      return false;
    }
  }

  render() {
    const { acl, roles, form } = this.props;

    return (
      <Collapse>
        {Object.keys(acl).map(resourceType => {
          const actions = acl[resourceType];
          return (
            <Panel header={resourceType} key={resourceType}>
              {Object.keys(actions).map(action => {
                const actionData = actions[action];
                return (
                  <Form.Item label={action}>
                    {form.getFieldDecorator(
                      `acl.${resourceType}.${action}.level`,
                      {
                        initialValue: actionData.level
                      }
                    )(
                      <Select>
                        {roles.map(role => {
                          return <Select.Option>{role.label}</Select.Option>;
                        })}
                      </Select>
                    )}
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
