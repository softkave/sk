import React from "react";
import { Row, Col, Button } from "antd";
import AddDropdownButton from "../AddDropdownButton.jsx";
import { generateBlockPermission } from "../../models/acl";

class Group extends React.Component {
  render() {
    const {
      group,
      children,
      blockHandlers,
      childrenTypes,
      onClickAddChild,
      fallbackPermission,
      name,
      user,
      onEdit
    } = this.props;
    const permission =
      group && group.acl
        ? generateBlockPermission(group.acl, user.permissions)
        : fallbackPermission;

    const permittedChildrenTypes = childrenTypes.filter(
      type => type !== "group" && permission[type] && permission[type].create
    );

    return (
      <div>
        <Row>
          <Col span={18}>{group.name || name}</Col>
          <Col span={6}>
            {permittedChildrenTypes.length > 0 && (
              <AddDropdownButton
                types={permittedChildrenTypes}
                onClick={type => onClickAddChild(type, group)}
              />
            )}
            {permission.group.update && (
              <Button icon="edit" onClick={() => onEdit(group)} />
            )}
            {permission.group["delete"] && (
              <Button
                icon="close"
                onClick={() => blockHandlers.onDelete(group)}
              />
            )}
          </Col>
        </Row>
        <div>{children}</div>
      </div>
    );
  }
}

export default Group;
