import React from "react";
import { Row, Col, Button } from "antd";
import AddDropdownButton from "../AddDropdownButton.jsx";
import {
  generateBlockPermission,
  canPerformAction,
  getClosestPermissionToBlock
} from "../../models/acl";
import "./group.css";
import SimpleBar from "simplebar-react";

import "simplebar/dist/simplebar.min.css";

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
    // const groupPermission =
    //   group && group.acl
    //     ? generateBlockPermission(group, user.permissions)
    //     : permission || {};

    const groupPermission = getClosestPermissionToBlock(
      user.permissions,
      group
    );

    console.log("group", this.props, childrenTypes, groupPermission);

    const permittedChildrenTypes = childrenTypes
      ? childrenTypes.filter(type => {
          return (
            type !== "group" &&
            canPerformAction(group, groupPermission, `CREATE_${type}`)
          );
        })
      : null;

    console.log(permittedChildrenTypes);

    return (
      <div className="sk-group">
        <Row className="sk-group-head">
          <Col span={12} style={{ minHeight: "32px" }}>
            <span style={{ fontWeight: "bold" }}>
              {group ? group.name : name}
            </span>
          </Col>
          <Col span={12} style={{ textAlign: "right" }}>
            {permittedChildrenTypes && permittedChildrenTypes.length > 0 && (
              <AddDropdownButton
                types={permittedChildrenTypes}
                onClick={type => onClickAddChild(type, group)}
              />
            )}
            {canPerformAction(group, groupPermission, "UPDATE_GROUP") && (
              <Button
                icon="edit"
                onClick={() => onEdit(group)}
                style={{ marginLeft: "2px" }}
              />
            )}
            {canPerformAction(group, groupPermission, "DELETE_GROUP") && (
              <Button
                icon="close"
                onClick={() => blockHandlers.onDelete(group)}
                style={{ marginLeft: "2px" }}
              />
            )}
          </Col>
        </Row>
        <SimpleBar className="sk-group-children">{children}</SimpleBar>
      </div>
    );
  }
}

export default Group;
