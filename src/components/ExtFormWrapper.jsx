import React from "react";
import { Col, Form, Input, Select, DatePicker, InputNumber } from "antd";
import FormWrapper from "./FormWrapper.jsx";
import BitSwitch from "./BitSwitch";
import moment from "moment";

class ExtFormWrapper extends React.Component {
  renderField = (params = {}) => {
    let {
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
      rule,
      props,
      render
    } = params;

    const { form, editing } = this.props;
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
      if (render) {
        field = render(params);
      } else if (type) {
        if (type === "text") {
          field = <Input {...props} placeholder={placeholder} />;
        } else if (type === "textarea") {
          field = <Input.TextArea {...props} placeholder={placeholder} />;
        } else if (type === "select") {
          field = (
            <Select {...props} placeholder={placeholder}>
              {options.map(option => {
                return <Select.Option key={option}>{option}</Select.Option>;
              })}
            </Select>
          );
        } else if (type === "datepicker") {
          field = (
            <DatePicker
              {...props}
              format={dateFormat}
              placeholder={placeholder}
            />
          );
          value = moment(value);
        } else if (type === "switch") {
          field = <BitSwitch {...props} options={options} />;
        } else if (type === "number") {
          field = (
            <InputNumber
              {...props}
              min={min}
              max={max}
              placeholder={placeholder}
            />
          );
        }
      } else {
        field = <Input {...props} placeholder={placeholder} />;
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

      field = <Form.Item label={labelName}>{value}</Form.Item>;
    }

    if (type === "textarea") {
      span.md = 24;
    }

    return <Col {...span}>{field}</Col>;
  };

  renderForm() {
    const { form, render, editing, onSubmit } = this.props;
    let data = form.getFieldsValue();
    let content = render({ renderField: this.renderField, data, editing });

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

export default Form.create()(ExtFormWrapper);
