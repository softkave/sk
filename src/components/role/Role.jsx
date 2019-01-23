import React from "react";
import { Row, Col, Button } from "antd";
import ManagedRoleLabelInput from "./ManagedRoleLabelInput.jsx";
import "./role.css";

export default class Role extends React.Component {
  // shouldComponentUpdate(nextProps) {
  //   if (this.props.role === nextProps.role) {
  //     return false;
  //   }
  // }

  render() {
    const {
      role,
      onUpVote,
      onDownVote,
      onDelete,
      onUpdateRoleLabel
    } = this.props;

    return (
      <ManagedRoleLabelInput
        onSubmit={onUpdateRoleLabel}
        render={({ toggleEditing }) => {
          return (
            <div className="sk-role">
              <Row>
                <Col span={14}>{role.label}</Col>
                <Col span={10}>
                  {onUpVote && <Button icon="caret-up" onClick={onUpVote} />}
                  {onDownVote && (
                    <Button icon="caret-down" onClick={onDownVote} />
                  )}
                  <Button icon="edit" onClick={toggleEditing} />
                  <Button icon="delete" onClick={onDelete} />
                </Col>
              </Row>
            </div>
          );
        }}
      />
    );
  }
}
