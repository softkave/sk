import React from "react";
import { Row, Col, Button } from "antd";
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
      onToggleEdit,
      disabled,
      className,
      style
    } = this.props;

    return (
      <div style={style} className={"sk-role " + (className || "")}>
        <Row>
          <Col span={10}>{role.label}</Col>
          {!disabled && (
            <Col span={14} style={{ textAlign: "right" }}>
              {onUpVote && (
                <Button
                  icon="caret-up"
                  onClick={onUpVote}
                  style={{ marginRight: "2px" }}
                />
              )}
              {onDownVote && (
                <Button
                  icon="caret-down"
                  onClick={onDownVote}
                  style={{ marginRight: "2px" }}
                />
              )}
              <Button
                icon="edit"
                onClick={onToggleEdit}
                style={{ marginRight: "2px" }}
              />
              <Button icon="delete" onClick={onDelete} />
            </Col>
          )}
        </Row>
      </div>
    );
  }
}
