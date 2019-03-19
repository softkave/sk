import React from "react";
import { Form } from "antd";
import get from "lodash/get";
import { applyErrors } from "./utils";

const FormItem = Form.Item;

class ComputeForm extends React.Component {
  static defaultProps = {
    data: {}
  };

  constructor(props) {
    super(props);
    this.state = {
      formError: props.formError,
      propFormError: props.formError
    };
  }

  componentDidMount() {
    this.applyFieldErrors();
  }

  componentDidUpdate(prevProps) {
    this.applyFieldErrors();
    if (this.state.propFormError !== prevProps.formError) {
      this.setState({
        formError: this.props.formError,
        propFormError: this.props.formError
      });
    }
  }

  onSubmit = event => {
    const { form, model, toggleSpinning } = this.props;
    if (event) {
      event.preventDefault();
    }

    form.validateFieldsAndScroll(async (errors, data) => {
      if (!errors) {
        try {
          if (toggleSpinning) {
            toggleSpinning();
          }

          if (model.onSubmit) {
            model.onSubmit(data, form);
          }
        } catch (thrownError) {
          if (thrownError instanceof Error) {
            this.setState({ formError: thrownError.message });
          } else {
            applyErrors(form, thrownError);
          }

          if (process.env.NODE_ENV === "development") {
            console.error(thrownError);
          }
        }
      }
    });
  };

  applyFieldErrors() {
    const { form, errors } = this.props;
    if (errors) {
      applyErrors(form, errors);
    }
  }

  // onSubmit = event => {
  //   if (event) {
  //     event.preventDefault();
  //   }

  //   const { form, model } = this.props;
  //   form.validateFieldsAndScroll((error, values) => {
  //     if (!error) {
  //       if (model.onSubmit) {
  //         delete values.error;
  //         model.onSubmit(values, form);
  //       }
  //     }
  //   });
  // };

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
    const { title, model, children } = this.props;
    const { formError } = this.state;
    return (
      <Form {...model.formProps} onSubmit={this.onSubmit}>
        {title && <Form.Item>{title}</Form.Item>}
        {formError && (
          <Form.Item style={{ color: "red" }}>
            {typeof formError === "string" ? (
              <h1 style={{ color: "red" }}>{formError}</h1>
            ) : (
              formError
            )}
          </Form.Item>
        )}
        {this.renderFields()}
        {children}
      </Form>
    );
  }
}

export default ComputeForm;
