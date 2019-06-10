import React from "react";

export default class ComplexFormField extends React.Component {
  constructor(props) {
    super(props);

    if (!props.form) {
      throw new Error("form is required");
    }
  }

  onChange = ({ value, errors }) => {
    const { form, id } = this.props;
    form.setFields({ [id]: { value, errors } });
  };

  render() {
    const { children } = this.props;
    const singleChild = React.Children.only(children);
    const clonedChild = React.cloneElement(singleChild, {
      onChange: this.onChange
    });

    return clonedChild;
  }
}
