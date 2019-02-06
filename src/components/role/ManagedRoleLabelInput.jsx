import React from "react";
import RoleLabelInput from "./RoleLabelInput.jsx";

export default class ManagedRoleLabelInput extends React.Component {
  state = {
    editing: false,
    value: null
  };

  toggleEditing = () => {
    this.setState(prevState => {
      let editing = !prevState.editing;
      return {
        editing,
        value: null
      };
    });
  };

  onChange = event => {
    this.setState({ value: event.target.value });
  };

  onSubmit = () => {
    const value = this.state.value;
    this.toggleEditing();
    this.props.onSubmit(value);
  };

  render() {
    const { editing, value, form, path } = this.state;

    if (editing) {
      return (
        <RoleLabelInput
          onChange={this.onChange}
          onSubmit={this.onSubmit}
          onCancel={this.toggleEditing}
          value={value}
          form={form}
          path={path}
        />
      );
    }

    return this.props.render({ toggleEditing: this.toggleEditing });
  }
}
