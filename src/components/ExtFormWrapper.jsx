import React from "react";
import { Col, Form, Input, Select, DatePicker, InputNumber } from "antd";
import FormWrapper from "./FormWrapper.jsx";
import BitSwitch from "./BitSwitch";
import moment from "moment";

class Profile extends React.Component {
  renderField = ({
    fieldName,
    labelName,
    type,
    value,
    options,
    placeholder,
    dateFormat,
    immutable,
    min,
    max,
    block,
    rule
  }) => {
    const { form } = this.props;
    const { editing } = this.state;
    let field = null;
    let span = block
      ? {
          xs: 24,
          sm: 24,
          md: 24
        }
      : {
          xs: 24,
          sm: 24,
          md: 12
        };

    if (editing && !immutable) {
      if (type === "text") {
        field = <Input placeholder={placeholder} />;
      } else if (type === "textarea") {
        field = <Input.TextArea placeholder={placeholder} />;
      } else if (type === "select") {
        field = (
          <Select placeholder={placeholder}>
            {options.map((option, i) => {
              return (
                <Select.Option key={option.key || i}>
                  {option.value}
                </Select.Option>
              );
            })}
          </Select>
        );
      } else if (type === "datepicker") {
        field = <DatePicker format={dateFormat} placeholder={placeholder} />;
        value = moment(value);
      } else if (type === "switch") {
        field = <BitSwitch options={options} />;
      } else if (type === "number") {
        field = <InputNumber min={min} max={max} placeholder={placeholder} />;
      } else {
        field = <Input placeholder={placeholder} />;
      }

      field = (
        <Form.Item label={labelName || fieldName}>
          {form.getFieldDecorator(fieldName, { rule, initialValue: value })(
            field
          )}
        </Form.Item>
      );
    } else {
      if (type === "switch") {
        value = <BitSwitch disabled options={options} defaultValue={value} />;
      }

      let divStyles = {};
      let fieldStyles = {};
      let valueStyles = {};

      field = (
        <div style={divStyles}>
          <div style={fieldStyles}>{labelName}:</div>
          <div style={valueStyles}>{value}</div>
        </div>
      );
    }

    if (type === "textarea") {
      span.md = 24;
    }

    return <Col {...span}>{field}</Col>;
  };

  renderForm() {
    const { form, render, editing, onSubmit } = this.props;
    let data = form.getFieldsValue();
    let content = render(this.renderField, { data, editing });

    if (editing) {
      content = (
        <FormWrapper form={form} onSubmit={onSubmit}>
          {content}
        </FormWrapper>
      );
    }

    return content;
  }

  render() {
    return this.renderForm();
  }
}

export default Form.create()(Profile);
