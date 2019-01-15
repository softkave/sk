import React from "react";
import { Form } from "antd";
import get from "lodash/get";

const FormItem = Form.Item;

class ComputeForm extends React.Component {
  static defaultProps = {
    data: {}
  };

  onSubmit = event => {
    if (event) {
      event.preventDefault();
    }

    const { form, model } = this.props;
    form.validateFieldsAndScroll((error, values) => {
      if (!error) {
        if (model.onSubmit) {
          model.onSubmit(form.getFieldsValue(), form);
        }
      }
    });
  };

  renderField(field, key, form, data) {
    if (field.render) {
      return field.render(field, form, data);
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
                firstFields: true,
                initialValue: get(data, key) || field.initialValue,
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
    const { model } = this.props;
    const renderedForm = (
      <Form {...model.formProps} onSubmit={this.onSubmit}>
        {this.renderFields()}
      </Form>
    );

    return renderedForm;
  }
}

export default ComputeForm;
