import React from "react";
import { Form } from "antd";
import { applyErrors } from "./form-utils";
import PropTypes from "prop-types";
import withSpinner from "./withSpinner.jsx";

const formWrapperPropTypes = {
  onSubmit: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  title: PropTypes.node,
  errors: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.shape({
        fieldName: PropTypes.string,
        value: PropTypes.any,
        errors: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.instanceOf(Error),
          PropTypes.arrayOf(
            PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Error)])
          )
        ])
      })
    ),
    PropTypes.shape({
      fieldName: PropTypes.string,
      value: PropTypes.any,
      errors: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.instanceOf(Error),
        PropTypes.arrayOf(
          PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Error)])
        )
      ])
    })
  ]),
  children: PropTypes.any,
  // formError: PropTypes.node,
  formProps: PropTypes.object
};

class FormWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stateError: null
    };
  }

  componentDidMount() {
    this.applyFieldErrors();
  }

  componentDidUpdate() {
    this.applyFieldErrors();
  }

  handleSubmit = event => {
    const { form, onSubmit, toggleSpinning } = this.props;
    if (event) {
      event.preventDefault();
    }

    form.validateFieldsAndScroll(async (errors, data) => {
      if (!errors) {
        try {
          if (toggleSpinning) {
            toggleSpinning();
          }

          await onSubmit(data);
        } catch (thrownError) {
          if (thrownError instanceof Error) {
            this.setState({
              stateError: thrownError.message
            });
          } else {
            applyErrors(form, thrownError);
          }

          if (process.env.NODE_ENV === "development") {
            console.error(thrownError);
          }
        } finally {
          if (toggleSpinning) {
            toggleSpinning();
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

  render() {
    const { title, children, formProps } = this.props;
    const { stateError } = this.state;

    return (
      <Form {...formProps} onSubmit={this.handleSubmit}>
        {title && <Form.Item>{title}</Form.Item>}
        {stateError && (
          <Form.Item style={{ color: "red" }}>
            {typeof stateError === "string" ? (
              <h3 style={{ color: "red", lineHeight: "1.25em" }}>
                {stateError}
              </h3>
            ) : (
              stateError
            )}
          </Form.Item>
        )}
        {children}
      </Form>
    );
  }
}

FormWrapper.propTypes = formWrapperPropTypes;

export default withSpinner(FormWrapper);
