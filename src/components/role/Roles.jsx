import React from "react";
import Role from "./Role.jsx";
import ManagedRoleLabelInput from "./ManagedRoleLabelInput.jsx";
import { Button } from "antd";

export default class Roles extends React.Component {
  shouldComponentUpdate(nextProps) {
    if (nextProps.roles === this.props.roles) {
      return false;
    }
  }

  updateRoleLevel = (index, upVote) => {
    let roles = [...this.props.value];
    let role = roles[index];
    if (upVote) {
      let precedingRole = roles[index - 1];
      role.level += 1;
      precedingRole.level -= 1;
    } else {
      let nextRole = roles[index + 1];
      role.level -= 1;
      nextRole.level += 1;
    }

    roles = roles.sort((role1, role2) => role1.level > role2.level);
    this.props.onChange(roles);
  };

  onUpVoteRole = index => {
    this.updateRoleLevel(index, true);
  };

  onDownVoteRole = index => {
    this.updateRoleLevel(index, false);
  };

  onDeleteRole = index => {
    let roles = [...this.props.value];
    roles.splice(index, 1);
    this.props.onChange(roles);
  };

  onUpdateRoleLabel = (index, label) => {
    let roles = [...this.props.value];
    let role = roles[index];
    role.label = label;
    this.props.onChange(roles);
  };

  onAddRole = label => {
    let roles = [...this.props.roles];
    let newRole = { label, level: roles.length };
    roles.push(newRole);
    this.props.onChange(roles);
  };

  render() {
    const { value } = this.props;
    return (
      <div>
        {value.map((role, index) => {
          return (
            <Role
              key={role.label}
              role={role}
              onUpVote={index > 0 ? () => this.upVoteRole(index) : null}
              onDownVote={
                index < role.length - 1 ? () => this.downVoteRole(index) : null
              }
              onDelete={() => this.onDeleteRole(index)}
              onUpdateRoleLabel={label => this.onUpdateRoleLabel(index, label)}
            />
          );
        })}
        <ManagedRoleLabelInput
          render={({ toggleEditing }) => {
            return (
              <Button block icon="plus" onClick={toggleEditing}>
                Add Role
              </Button>
            );
          }}
          onSubmit={this.onAddRole}
        />
      </div>
    );
  }
}
