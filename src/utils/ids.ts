import { resourceTypeShortNames, shortNameToResourceTypeMap } from "../models/app/constants";
import { SystemResourceType } from "../models/app/types";
import { assertArg } from "./utils";
const uuid = require("uuid/v4");

const idSeperator = "_";

export function getNewId() {
  return uuid();
}

export function getNewId02(resourceType: SystemResourceType, id?: string) {
  return `${resourceTypeShortNames[resourceType]}${idSeperator}${id || getNewId()}`;
}

export function tryGetResourceTypeFromId(id: string): SystemResourceType | undefined {
  const [shortName] = id.split(idSeperator);
  const type = shortNameToResourceTypeMap[shortName];
  return type;
}

export function assertGetResourceTypeFromId(id: string) {
  const type = tryGetResourceTypeFromId(id);
  assertArg(type, new Error("Provided ID is invalid"));
  return type;
}
