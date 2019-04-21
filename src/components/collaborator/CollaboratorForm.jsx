import React from "react";
import ExtFormWrapper from "../ExtFormWrapper";
import { Form } from "antd";
import modalWrap from "../modalWrap";

class CollaboratorForm extends React.Component {
  renderForm = ({ renderField, data }) => {
    const { roles, collaborator, block } = this.props;

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
        {renderField({
          fieldName: "role",
          labelName: "Role",
          type: "select",
          value: (
            collaborator.permissions.find(role => {
              return role.blockId === Array.isArray(block.parents) &&
                block.parents.length > 1
                ? block.parents[0]
                : block.id;
            }) || {}
          ).role,
          options: roles
            .filter(role => {
              return role.role !== "public";
            })
            .map(role => {
              return role.role;
            }),
          placeholder: "Select role",
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
