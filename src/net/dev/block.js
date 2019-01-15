import {
  generateACL,
  blockActionTypes,
  generateRolesActions
} from "../../models/acl";
import { defaultRolesMap, generateRolesArr } from "../../models/roles";
import { generatePermission } from "../../models/user/permission";

//const uuid = require("uuid/v4");
const nanoid = require("nanoid");
const randomColor = require("randomcolor");
const {
  generateError,
  makeShouldRespondWithError,
  devShare
} = require("./utils");
const shouldRespondWithError = makeShouldRespondWithError();

module.exports = {
  getInitBlocks() {
    const userId = nanoid();
    const rootBlockId = nanoid();
    const rootBlockRoles = generateRolesArr(defaultRolesMap);
    const rootBlockAcl = blockActionTypes.concat(
      generateRolesActions(rootBlockRoles)
    );

    let rootBlock = {
      id: rootBlockId,
      type: "root",
      name: `root_${user.name}`,
      color: randomColor(),
      owner: rootBlockId,
      createdBy: userId,
      acl: generateACL(rootBlockAcl),
      roles: rootBlockRoles
    };

    return [rootBlock];
  }
};
