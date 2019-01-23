import {
  generateACL,
  blockActionTypes,
  generateRolesActions
} from "../../models/acl";
import { getPersonalRolesArr } from "../../models/roles";
import { generatePermission } from "../../models/user/permission";

//const uuid = require("uuid/v4");
const nanoid = require("nanoid");
const randomColor = require("randomcolor");
// const {
//   //generateError,
//   //makeShouldRespondWithError,
//   devShare
// } = require("./utils");
//const shouldRespondWithError = makeShouldRespondWithError();
let rootBlock = null;

module.exports = {
  signup(user) {
    /*if (shouldRespondWithError("signup")) {
      throw generateError(user);
    }*/

    const userId = nanoid();
    const rootBlockId = nanoid();
    const rootBlockRoles = getPersonalRolesArr();
    const rootBlockAcl = blockActionTypes.concat(
      generateRolesActions(rootBlockRoles)
    );

    rootBlock = {
      id: rootBlockId,
      type: "root",
      name: `root_${user.name}`,
      color: randomColor(),
      owner: rootBlockId,
      createdBy: userId,
      acl: generateACL(rootBlockAcl),
      roles: rootBlockRoles
    };

    const token = "abcd";
    const generatedUserData = {
      id: userId,
      name: user.name,
      email: user.email,
      createdAt: Date.now(),
      color: randomColor(),
      lastNotificationCheckTime: Date.now(),
      permissions: [generatePermission(rootBlock, rootBlock.roles[0], userId)]
    };

    // devShare("user", { token, rootBlock, user: generatedUserData });
    // console.log(devShare("user"));

    // sessionStorage.setItem("user", JSON.stringify({ user: generatedUserData, token }));
    sessionStorage.setItem("rootBlock", JSON.stringify(rootBlock));

    return {
      //rootBlock,
      token,
      user: generatedUserData
    };
  },

  login(user) {
    /*if (shouldRespondWithError("login")) {
      throw generateError(user);
    }*/

    return {
      token: "abcd",
      user: null
    };
  },

  forgotPassword() {},
  changePassword() {},
  userExists() {},
  updateUser() {},
  changePasswordWithToken() {},

  getCollaborationRequests() {
    return [
      {
        id: nanoid(),
        from: {
          blockName: "Abayomi",
          blockId: nanoid(),
          userId: nanoid(),
          userName: "Abayomi Akintomide"
        },
        to: {
          email: "ywordk@gmail.com"
        },
        createdAt: Date.now(),
        permission: {
          level: 3,
          role: "admin"
        }
      },
      {
        id: nanoid(),
        from: {
          blockName: "Yomi",
          blockId: nanoid(),
          userId: nanoid(),
          userName: "Abayomi Akintomide"
        },
        to: {
          email: "ywordk@gmail.com"
        },
        createdAt: Date.now(),
        permission: {
          level: 3,
          role: "admin"
        }
      },
      {
        id: nanoid(),
        from: {
          blockName: "Yomi S",
          blockId: nanoid(),
          userId: nanoid(),
          userName: "Abayomi Akintomide"
        },
        to: {
          email: "ywordk@gmail.com"
        },
        createdAt: Date.now(),
        permission: {
          level: 3,
          role: "admin"
        }
      }
    ];
  },

  respondToCollaborationRequest() {},
  updateCollaborationRequest() {}
};
