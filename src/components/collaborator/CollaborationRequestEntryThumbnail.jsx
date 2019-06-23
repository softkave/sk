import React from "react";
import styled from "styled-components";
import { Button, Row, Col } from "antd";
import DeleteButton from "../DeleteButton";

export default class CollaborationRequestEntryThumbnail extends React.Component {
  render() {
    const { request, onEdit, onDelete } = this.props;

    return (
      <Container>
        <EmailAddress>{request.email}</EmailAddress>
        <p>
          {request.message}
          <br />
          {request.expiresAt}
        </p>
        <Row gutter={16}>
          <Col span={12}>
            <Button type="primary" onClick={onEdit}>
              Edit
            </Button>
          </Col>
          <Col span={12}>
            <DeleteButton
              deleteButton={<Button type="danger">Delete</Button>}
              onDelete={onDelete}
              title="Are you sure you want to delete this request?"
            />
          </Col>
        </Row>
      </Container>
    );
  }
}

const Container = styled.div({
  padding: "1em",
  borderRadius: "4px"
});

const EmailAddress = styled.div({
  fontWeight: "bold"
});
