import React from "react";
import { Row, Col, Button } from "antd";
import AddDropdownButton from "../AddDropdownButton.jsx";
import { generateBlockPermission } from "../../models/acl";
import "./group.css";

class Group extends React.Component {
  render() {
    const {
      group,
      children,
      blockHandlers,
      childrenTypes,
      onClickAddChild,
      permission,
      name,
      user,
      onEdit
    } = this.props;
    const groupPermission =
      group && group.acl
        ? generateBlockPermission(group.acl, user.permissions)
        : permission || {};

    const permittedChildrenTypes = childrenTypes
      ? childrenTypes.filter(type => {
          return (
            type !== "group" &&
            groupPermission[type] &&
            groupPermission[type].create
          );
        })
      : null;

    console.log(
      "group",
      this.props,
      permittedChildrenTypes,
      childrenTypes,
      groupPermission
    );

    return (
      <div className="sk-group">
        <Row>
          <Col span={16}>{group ? group.name : name}</Col>
          <Col span={8}>
            {permittedChildrenTypes && permittedChildrenTypes.length > 0 && (
              <AddDropdownButton
                types={permittedChildrenTypes}
                onClick={type => onClickAddChild(type, group)}
              />
            )}
            {groupPermission.group && groupPermission.group.update && (
              <Button icon="edit" onClick={() => onEdit(group)} />
            )}
            {groupPermission.group && groupPermission.group["delete"] && (
              <Button
                icon="close"
                onClick={() => blockHandlers.onDelete(group)}
              />
            )}
          </Col>
        </Row>
        <div className="sk-group-children">{children}</div>
      </div>
    );
  }
}

export default Group;
