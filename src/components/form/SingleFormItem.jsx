import React from "react";
import PropTypes from "prop-types";
import { Form } from "antd";

const singleFormItemPropTypes = {
  registerComponent: PropTypes.func.isRequired,
  unregisterComponent: PropTypes.func.isRequired,
  getValueFromEvent: PropTypes.func.isRequired,
  render: PropTypes.func,
  validate: PropTypes.func,
  error: PropTypes.string,
  value: PropTypes.any,
  help: PropTypes.node,
  extra: PropTypes.node,
  label: PropTypes.node
};

export default class SingleFormItem extends React.PureComponent {
  static propTypes = singleFormItemPropTypes;

  constructor(props) {
    super(props);

    this.state = {
      error: props.error,
      value: props.value,
      help: props.help,
      extra: props.extra,
      validateStatus: props.validateStatus
    };
  }

  componentDidMount() {
    const { registerComponent, id } = this.props;
    const { error, value, help, extra, validateStatus } = this.state;

    registerComponent(
      {
        id
      },
      ({ onChange }) => {
        this.managerOnChange = onChange;

        return {
          error,
          value,
          help,
          extra,
          validateStatus,
          update: this.update,
          validate: this.validate
        };
      }
    );
  }

  componentWillUnmount() {
    const { unregisterComponent, id } = this.props;

    unregisterComponent({ id });
  }

  onChange = event => {
    const { getValueFromEvent } = this.props;
    const value = getValueFromEvent(event);
    this.managerOnChange({ value });
  };

  validate = async data => {
    const { validate } = this.props;

    if (typeof validate === "function") {
      let validationError = null;

      try {
        validationError = await validate(data);
      } catch (error) {
        validationError = error;
      }

      return validationError;
    }
  };

  update = update => {
    this.setState(update);
  };

  render() {
    const { children, render } = this.props;
    const { value } = this.state;

    if (render) {
      return render({ ...this.props, ...this.state });
    } else {
      const singleChild = React.Children.only(children);
      const clonedChild = React.cloneElement(singleChild, {
        value,
        onChange: this.onChange
      });

      return (
        <Form.Item {...this.props} {...this.state}>
          {clonedChild}
        </Form.Item>
      );
    }
  }
}
