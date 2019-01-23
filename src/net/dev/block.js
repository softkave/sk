import {
  generateACL,
  blockActionTypes,
  generateRolesActions
} from "../../models/acl";
import { defaultRolesMap, generateRolesArr } from "../../models/roles";
import { generatePermission } from "../../models/user/permission";

module.exports = {
  getInitBlocks() {
    // const userId = nanoid();
    // const rootBlockId = nanoid();
    // const rootBlockRoles = generateRolesArr(defaultRolesMap);
    // const rootBlockAcl = blockActionTypes.concat(
    //   generateRolesActions(rootBlockRoles)
    // );

    let rootBlock = JSON.parse(sessionStorage.getItem("rootBlock"));

    return [rootBlock];
  },

  getPermissionBlocks() {
    return [];
  }
};
