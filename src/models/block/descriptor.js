import { makeDescriptorFieldsRequired } from "../../utils/descriptor";
import trim from "../../utils/trim";

const textPattern = {
  pattern: /\w+/,
  message: "only alphanumeric characters allowed"
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

const requiredOrgFields = ["name"];

export const orgDescriptor = makeDescriptorFieldsRequired(
  blockDescriptor,
  requiredOrgFields
);
