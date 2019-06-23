import React from "react";
import util from "util";

export default function withForm(component) {
  const Component = component;
  const displayName = `withForm(${component.displayName ||
    component.name ||
    "Component"})`;

  class WithForm extends React.Component {
    async getFormData() {
      const { form } = this.props;
      const promisifiedValidateFieldsAndScroll = util.promisify(
        form.validateFieldsAndScroll
      );

      return await promisifiedValidateFieldsAndScroll();
    }

    render() {
      const { form, forwardedRef } = this.props;
      return <Component {...this.props} form={form} ref={forwardedRef} />;
    }
  }

  function forwardRef(props, ref) {
    return <WithForm {...props} forwardedRef={ref} ref={props.formRef} />;
  }

  WithForm.displayName = displayName;
  forwardRef.displayName = displayName;
  return React.forwardRef(forwardRef);
}
