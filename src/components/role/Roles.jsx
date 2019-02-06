import React from "react";
import Role from "./Role.jsx";
import { Button, Form } from "antd";
import RoleLabelInput from "./RoleLabelInput.jsx";
import asyncValidator from "async-validator";
import trim from "../../utils/trim";
import "./roles.css";

export default class Roles extends React.Component {
  constructor(props) {
    super(props);
    const rules = {
      label: [
        { required: true, message: "role name is required", transform: trim },
        { type: "string", max: 50, message: "max cars - 50" },
        {
          pattern: /^[A-Za-z0-9]+$/,
          message: "invalid name, only alphanumeric chars accepted"
        },
        { validator: this.checkIfRoleNameExists }
      ],
      level: { type: "number" }
    };

    this.v = new asyncValidator(rules, {});
  }

  // shouldComponentUpdate(nextProps) {
  //   if (nextProps.roles === this.props.roles) {
  //     return false;
  //   }
  // }

  onAddRole = () => {
    const { form } = this.props;
    const keys = form.getFieldValue("roleKeys");
    const roles = form.getFieldValue("roles");
    let nextKeys = [...keys];
    nextKeys.splice(1, 0, { editing: true });
    let nextRoles = [...roles];
    nextRoles.splice(1, 0, { label: "", level: 1 });
    this.updateLevelsFromUp(nextRoles, 1);
    // nextRoles = this.sortRoles(nextRoles);
    this.isAddingNewRole = true;
    form.setFieldsValue({
      keys: nextKeys,
      roles: nextRoles
    });
  };

  sortRoles(roles) {
    return roles.sort((role1, role2) => role1.level > role2.level);
  }

  swapRoles(roles, a, b) {
    let temp = roles[a];
    const roleALevel = roles[a].level;
    const roleBLevel = roles[b].level;
    roles[a] = roles[b];
    roles[b] = temp;
    roles[a].level = roleALevel;
    roles[b].level = roleBLevel;
  }

  updateLevelsFromUp(roles, fromIndex) {
    let prevLevel = roles[fromIndex].level;
    for (let i = fromIndex + 1; i < roles.length; i++) {
      roles[i].level = prevLevel + 1;
      prevLevel += 1;
    }
  }

  updateLevelsFromDown(roles, fromIndex) {
    let prevLevel = roles[fromIndex].level;
    for (let i = fromIndex - 1; i >= 0; i--) {
      roles[i].level = prevLevel - 1;
      prevLevel -= 1;
    }
  }

  updateRoleLevel = (index, upVote) => {
    const { form } = this.props;
    let roles = form.getFieldValue("roles");
    // let role = roles[index];
    if (upVote) {
      // let precedingRole = roles[index - 1];
      // if (role.level > 1) {
      //   precedingRole.level -= 1;
      // }

      // role.level += 1;
      this.swapRoles(roles, index, index + 1);
    } else {
      // let nextRole = roles[index + 1];
      // role.level -= 1;
      // nextRole.level += 1;
      this.swapRoles(roles, index, index - 1);
    }

    // roles = this.sortRoles(roles);
    form.setFieldsValue({ roles });
  };

  onUpVoteRole = index => {
    this.updateRoleLevel(index, true);
  };

  onDownVoteRole = index => {
    this.updateRoleLevel(index, false);
  };

  onDeleteRole = index => {
    const { form } = this.props;
    let roles = [...form.getFieldValue("roles")];
    let keys = [...form.getFieldValue("roleKeys")];
    roles.splice(index, 1);
    keys.splice(index, 1);
    this.updateLevelsFromUp(roles, 0);
    this.error = null;
    form.setFieldsValue({ roles, keys });
  };

  checkIfRoleNameExists = (rule, value, cb) => {
    const { form } = this.props;
    const roles = form.getFieldValue("roles");
    value = value.toLowerCase();
    const exists = roles.find((role, index) => {
      return (
        this.roleIndexBeingEdited !== index &&
        role.label.toLowerCase() === value
      );
    });

    if (exists) {
      cb("role exists");
    } else {
      cb();
    }
  };

  onCompleteEdit = (form, index, keys) => {
    this.roleIndexBeingEdited = null;
    this.isAddingNewRole = false;
    this.error = null;
    form.validateFields([`roles[${index}]`], error => {
      if (!error) {
        let kk = [...keys];
        kk[index].editing = false;
        form.setFieldsValue({ keys: kk });
      }
    });
  };

  onToggleEdit = (form, index, keys, roles) => {
    let kk = [...keys];
    const isEditing = !kk[index].editing;
    kk[index].editing = isEditing;
    if (isEditing) {
      this.cacheRole = { ...roles[index] };
      this.roleIndexBeingEdited = index;
    }

    this.error = null;
    form.setFieldsValue({ keys: kk });
  };

  onCancelEdit = (form, index, keys, roles) => {
    if (this.isAddingNewRole) {
      this.onDeleteRole(index);
      this.isAddingNewRole = false;
      return;
    }

    let kk = [...keys];
    kk[index].editing = false;
    let rr = [...roles];
    if (this.cacheRole) {
      rr[index] = this.cacheRole;
      this.cacheRole = null;
    }

    this.roleIndexBeingEdited = null;
    this.isAddingNewRole = false;
    this.error = null;
    form.setFieldsValue({ keys: kk, roles: rr });
  };

  render() {
    const { form } = this.props;

    const rr = this.props.roles;
    form.getFieldDecorator("roleKeys", {
      initialValue: (rr || []).map(() => {
        return { editing: false };
      })
    });

    form.getFieldDecorator("roles", {
      initialValue: rr
    });

    const keys = form.getFieldValue("roleKeys");
    const roles = form.getFieldValue("roles") || rr;
    let editing = false;
    let items = [];
    for (let index = keys.length - 1; index >= 0; index--) {
      let con = null;
      const k = keys[index];
      const role = roles[index];
      if (k.editing) {
        editing = true;
        con = (
          <Form.Item
            key={(role && role.label + index) || index}
            help={
              this.error && this.error.index === index ? (
                <span style={{ color: "red" }}>{this.error.message}</span>
              ) : null
            }
          >
            <RoleLabelInput
              value={role}
              onChange={null}
              onCompleteEdit={(onChange, value) => {
                this.onCompleteEdit(form, index, keys);
              }}
              onCancel={() => {
                this.onCancelEdit(form, index, keys, roles);
              }}
              onChangeInput={(event, onChange, l) => {
                // onChange({ ...l, label: event.target.value });
                this.v.validate(
                  { label: event.target.value, level: role.level },
                  (errors, fields) => {
                    if (errors) {
                      this.error = { index, message: errors[0].message };
                    } else {
                      this.error = null;
                    }

                    let uRoles = [...roles];
                    let uRole = { ...uRoles[index] };
                    uRole.label = event.target.value;
                    uRoles[index] = uRole;
                    form.setFieldsValue({ roles: uRoles });
                  }
                );
              }}
              getValue={value => {
                return value ? value.label : null;
              }}
            />
          </Form.Item>
        );
      } else {
        con = (
          <Role
            key={role.label}
            className="sk-roles-role"
            role={role}
            onUpVote={
              index < roles.length - 1 ? () => this.onUpVoteRole(index) : null
            }
            onDownVote={index > 1 ? () => this.onDownVoteRole(index) : null}
            onDelete={() => this.onDeleteRole(index)}
            onToggleEdit={() => {
              this.onToggleEdit(form, index, keys, roles);
            }}
            disabled={index === 0 || this.isAddingNewRole}
          />
        );
      }

      items.push(
        con
        // <Form.Item
        //   key={(role && role.label + index) || index}
        //   help={
        //     this.error && this.error.index === index ? (
        //       <span style={{ color: "red" }}>{this.error.message}</span>
        //     ) : null
        //   }
        // >
        //   {con}
        //   {
        //     //   form.getFieldDecorator(`roles[${index}]`, {
        //     //   rules: [
        //     //     {
        //     //       validator: (rule, value, cb) => {
        //     //         this.v.validate(value, (errors, fields) => {
        //     //           if (errors) {
        //     //             cb(errors[0].message);
        //     //           } else {
        //     //             cb();
        //     //           }
        //     //         });
        //     //       }
        //     //     }
        //     //   ],
        //     //   validateFirst: true,
        //     //   //preserve: true,
        //     //   initialValue: role
        //     // })(con)
        //   }
        // </Form.Item>
      );
    }

    return (
      <div>
        {items}
        {(!editing || keys.length <= 10) && (
          <Button block icon="plus" onClick={this.onAddRole}>
            Add Role
          </Button>
        )}
      </div>
    );
  }
}
