import React from "react";
import { Form } from "antd";
import get from "lodash/get";
import FormWrapper from "../FormWrapper";

const FormItem = Form.Item;

class ComputeForm extends React.Component {
  static defaultProps = {
    data: {}
  };

  onSubmit = async data => {
    const { form, model } = this.props;

    if (model.onSubmit) {
      return model.onSubmit(data, form);
    }
  };

  renderField(field, key, form, data) {
    if (field.render) {
      return field.render(form, data, key, field);
    } else if (field.component) {
      const FieldComponent = field.component;
      const renderedFieldComponent = <FieldComponent {...field.props} />;
      return (
        <FormItem
          key={key}
          label={field.label}
          labelCol={field.labelCol}
          wrapperCol={field.wrapperCol}
          extra={field.extra}
          hasFeedback={field.hasFeedback}
        >
          {field.noDecorate
            ? renderedFieldComponent
            : form.getFieldDecorator(key, {
                rules: field.rules,
                validateFirst: true,
                initialValue: field.getValue
                  ? field.getValue(data, key, field)
                  : get(data, key) || field.initialValue,
                valuePropName: field.valuePropName || "value"
              })(renderedFieldComponent)}
        </FormItem>
      );
    }
  }

  renderFields() {
    const { form, model, data } = this.props;
    let computedForm = [];
    for (const key in model.fields) {
      const field = model.fields[key];
      computedForm.push(this.renderField(field, key, form, data));
    }

    return computedForm;
  }

  render() {
    const { children, form } = this.props;

    return (
      <FormWrapper form={form} onSubmit={this.onSubmit}>
        {this.renderFields()}
        {children}
      </FormWrapper>
    );
  }
}

export default ComputeForm;
