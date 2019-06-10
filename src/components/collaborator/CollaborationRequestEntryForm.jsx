import React from "react";
import { DatePicker, Input, Form, Button, Row, Col } from "antd";
import moment from "moment";
import DeleteButton from "../DeleteButton";

export default class CollaborationRequestEntryForm extends React.Component {
  render() {
    const { form, onDelete, onSubmit } = this.props;
    const dateFormat = "MMM DD, YYYY";

    return (
      <div>
        <Form.Item label="Email address" style={{ marginBottom: "4px" }}>
          {form.getFieldDecorator("email")(<Input autoComplete="off" />)}
        </Form.Item>
        <Form.Item label="Message">
          {form.getFieldDecorator("message")(
            <Input.TextArea autosize autoComplete="off" />
          )}
        </Form.Item>
        <Form.Item label="Expires at">
          {form.getFieldDecorator("expiresAt")(
            <DatePicker
              format={dateFormat}
              disabledDate={current => {
                return (
                  current &&
                  current <
                    moment()
                      .subtract(1, "day")
                      .endOf("day")
                );
              }}
            />
          )}
        </Form.Item>
        <Row gutter={16}>
          <Col span={12}>
            <Button type="primary" onClick={onSubmit}>
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
      </div>
    );
  }
}
