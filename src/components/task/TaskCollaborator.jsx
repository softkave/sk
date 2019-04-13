import React from "react";
import { Row, Col, Switch, Button } from "antd";
import Thumbnail from "../thumbnail/Thumbnail.jsx";

export default class TaskCollaborator extends React.Component {
  render() {
    const { collaborator, collaboratorTaskData, onUnassign } = this.props;

    return (
      <Thumbnail
        data={collaborator}
        colorSpan={4}
        renderInfo={() => {
          return (
            <Row>
              <Col span={14}>{collaborator.name}</Col>
              <Col span={10} style={{ textAlign: "right" }}>
                <Switch
                  disabled={true}
                  checked={collaboratorTaskData.data}
                  onChange={null}
                  style={{ marginRight: "16px" }}
                />
                <Button type="danger" icon="close" onClick={onUnassign} />
              </Col>
            </Row>
          );
        }}
        style={{
          height: "60px",
          padding: "4px",
          cursor: "inherit"
        }}
        hoverable={false}
      />
    );
  }
}
