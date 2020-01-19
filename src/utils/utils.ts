const uuid = require("uuid/v4");
// const getId = require("nanoid");

export function newId() {
  return uuid();
}

export const pluralize = (str: string) => {
  return `${str}s`;
};
