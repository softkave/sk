import { makeDescriptorFieldsRequired } from "../../utils/descriptor";
import trim from "../../utils/trim";

const textPattern = {
  pattern: /\w+/,
  message: "only alphanumeric characters allowed"
};

export const aclDescriptor = {
  action: [
    {
      type: "string",
      max: 50,
      transform: trim
    },
    textPattern
  ],
  level: {
    type: "number"
  }
};

export const roleDescriptor = {
  role: [
    {
      type: "string",
      max: 50,
      transform: trim
    },
    textPattern
  ],
  level: {
    type: "number"
  }
};

export const blockDescriptor = {
  name: [
    {
      type: "string",
      max: 50,
      transform: trim
    },
    textPattern
  ],
  description: [
    {
      type: "string",
      max: 250
    },
    {
      pattern: /[\w\s]+/,
      message: "only alphanumeric characters allowed"
    }
  ],
  expectedEndAt: [
    {
      type: "number"
    }
  ],
  completedAt: [
    {
      type: "number"
    }
  ],
  roles: [
    {
      type: "array",
      max: 10,
      validator: function(rule, value, cb) {
        let existingRoles = {};
        let errorExist = false;
        value.some((role, i) => {
          if (existingRoles[role.role]) {
            cb("role with the same name already exist.");
            errorExist = true;
            return true;
          }

          existingRoles[role.role] = role;
          return errorExist;
        });

        if (!errorExist) {
          cb();
        }
      }
    }
  ]
};

const requiredTaskFields = ["description"];
export const taskDescriptor = makeDescriptorFieldsRequired(
  blockDescriptor,
  requiredTaskFields
);

const requiredGroupFields = ["name"];
export const groupDescriptor = makeDescriptorFieldsRequired(
  blockDescriptor,
  requiredGroupFields
);

const requiredProjectFields = ["name"];
export const projectDescriptor = makeDescriptorFieldsRequired(
  blockDescriptor,
  requiredProjectFields
);

const requiredOrgFields = ["name", "roles"];

export const orgDescriptor = makeDescriptorFieldsRequired(
  blockDescriptor,
  requiredOrgFields
);
