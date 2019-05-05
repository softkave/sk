import React from "react";
import ExtFormWrapper from "../ExtFormWrapper";
import { Form } from "antd";
import modalWrap from "../modalWrap";

class CollaboratorForm extends React.Component {
  renderForm = ({ renderField, data }) => {
    const { collaborator } = this.props;

    return (
      <React.Fragment>
        {renderField({
          fieldName: "name",
          labelName: "Name",
          type: "input",
          value: collaborator.name,
          immutable: true,
          block: true
        })}
        {renderField({
          fieldName: "email",
          labelName: "Email address",
          type: "input",
          value: collaborator.email,
          immutable: true,
          block: true
        })}
      </React.Fragment>
    );
  };

  render() {
    const { form, onSubmit } = this.props;

    return (
      <ExtFormWrapper
        editing
        render={this.renderForm}
        onSubmit={onSubmit}
        form={form}
      />
    );
  }
}

// TODO: change "Collaborator to collaborator name"
export default modalWrap(Form.create()(CollaboratorForm), "Collaborator");
