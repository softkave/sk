import React from "react";
import { Row, Col, Switch, Button } from "antd";
import Thumbnail from "../../thumbnail/Thumbnail";

export default class TaskCollaboratorThumbnail extends React.Component {
  render() {
    const { collaborator, taskCollaborator, onUnassign } = this.props;

    return (
      <Thumbnail
        data={collaborator}
        colorSpan={4}
        renderInfo={() => {
          return (
            <Row>
              <Col span={14}>
                <div>{collaborator.name}</div>
                <div style={{ marginTop: "8px" }}>
                  <Switch
                    disabled={true}
                    checked={taskCollaborator.data}
                    onChange={null}
                    style={{ marginRight: "16px" }}
                  />
                </div>
              </Col>
              <Col span={10} style={{ textAlign: "right" }}>
                <Button type="danger" icon="close" onClick={onUnassign} />
              </Col>
            </Row>
          );
        }}
        style={{
          minHeight: "60px",
          maxWidth: "320px",
          padding: "4px",
          cursor: "inherit",
          display: "inline-block",
          margin: "4px 0 0 4px"
        }}
        hoverable={false}
      />
    );
  }
}
