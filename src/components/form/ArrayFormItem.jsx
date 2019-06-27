import React from "react";
import { DatePicker, Input, Form, Button, Divider, Row, Col } from "antd";
import dotProp from "dot-prop-immutable";
import asyncValidator from "async-validator";
import {
  promisifyAsyncValidator,
  makeNameExistsValidator
} from "../../utils/descriptor";
import { waitForPromises } from "../../utils/promise";
import { indexArray } from "../../utils/object";
import moment from "moment";

export default class ArrayFormItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = { errors: {} };
  }

  hasError = () => {
    return !!Object.keys(this.state.errors).length;
  };

  getError = index => {
    if (typeof index === "number") {
      return this.state.errors[index];
    }

    return this.state.errors;
  };

  addField = () => {
    const { value, addField, onChange } = this.props;
    const updatedValue = addField(value);
    onChange(updatedValue);
  };

  deleteField = index => {
    const { value, deleteField, onChange } = this.props;
    const updatedValue = deleteField(index, value);
    onChange(updatedValue);
  };

  onChange = (index, event) => {
    const { getValueFromEvent, validate, value, onChange } = this.props;
    const eventValue = getValueFromEvent(event);
    const error = validate(eventValue, value);
    this.setState({ errors: { ...this.state.errors, [index]: error } }, () => {
      onChange(eventValue);
    });
  };

  render() {
    const { value, render } = this.props;
    const { errors } = this.state;

    return value.map((data, index) => {
      return render({
        value: data,
        error: errors[index],
        onChange: this.onChange
      });
    });
  }
}
