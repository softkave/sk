import { Form, Spin } from "antd";
import * as React from "react";
import FormMessage from "./FormMessage";

export class NewFormFormik extends React.Component {
  private isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      error: null,
      message: null,
      isSubmitting: false
    };
  }

  public componentDidMount() {
    this.isMounted = true;
  }

  public componentWillUnmount() {
    this.isMounted = false;
  }

  public render() {
    const { children } = this.props;
    const { isSubmitting, message, error } = this.state;

    return (
      <Spin spinning={isSubmitting}>
        <FormMessage message={error} type="error" />
        <FormMessage message={message} type="message" />
        <Form onSubmit={this.onSubmit}>{children}</Form>
      </Spin>
    );
  }

  private externalSetState = newState => {
    if (this.isMounted) {
      this.setState(newState);
    }
  };

  private onSubmit = event => {
    if (event && event.preventDefault) {
      event.preventDefault();
    }

    const { form, onSubmit, onError, onSuccess, onComplete } = this.props;

    form.validateFieldsAndScroll(async (errors, values) => {
      if (!errors) {
        try {
          this.setState({ isSubmitting: true, error: null, message: null });
          await onSubmit(values, { setState: this.externalSetState });
          onSuccess(values);
        } catch (thrownError) {
          onError(thrownError, { setState: this.externalSetState });
        }

        this.setState({ isSubmitting: false });
        onComplete(values, { setState: this.externalSetState });
      }
    });
  };
}
