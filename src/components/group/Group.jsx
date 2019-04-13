import React from "react";
import { Row, Col, Button } from "antd";
import AddDropdownButton from "../AddDropdownButton.jsx";
import {
  canPerformAction,
  getClosestPermissionToBlock
} from "../../models/block/acl";
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
      name,
      user,
      onEdit
    } = this.props;

    const groupPermission = getClosestPermissionToBlock(
      user.permissions,
      group
    );

    const permittedChildrenTypes = childrenTypes
      ? childrenTypes.filter(type => {
          return (
            type !== "group" &&
            canPerformAction(group, groupPermission, `CREATE_${type}`)
          );
        })
      : null;

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
