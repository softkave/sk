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
let userCache = null;

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

    userCache = generatedUserData;

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
          blockType: "org",
          userId: nanoid(),
          userName: "Abayomi Akintomide"
        },
        to: {
          email: "ywordk@gmail.com"
        },
        createdAt: Date.now(),
        role: {
          level: 3,
          label: "admin"
        }
      },
      {
        id: nanoid(),
        from: {
          blockName: "Yomi",
          blockId: nanoid(),
          userId: nanoid(),
          userName: "Abayomi Akintomide",
          blockType: "org"
        },
        to: {
          email: "ywordk@gmail.com"
        },
        createdAt: Date.now(),
        role: {
          level: 3,
          label: "admin"
        }
      },
      {
        id: nanoid(),
        from: {
          blockName: "Yomi S",
          blockId: nanoid(),
          userId: nanoid(),
          userName: "Abayomi Akintomide",
          blockType: "org"
        },
        to: {
          email: "ywordk@gmail.com"
        },
        createdAt: Date.now(),
        role: {
          level: 3,
          label: "admin"
        }
      }
    ];
  },

  respondToCollaborationRequest({ request, response }) {
    if (response.toLowerCase() === "accepted") {
      const rootBlockRoles = getPersonalRolesArr();
      const rootBlockAcl = blockActionTypes.concat(
        generateRolesActions(rootBlockRoles)
      );

      let org = {
        id: request.from.blockId,
        type: request.from.blockType,
        name: request.from.blockName,
        color: randomColor(),
        owner: request.from.blockId,
        createdBy: request.from.userId,
        acl: generateACL(rootBlockAcl),
        roles: rootBlockRoles,
        collaborators: [
          {
            id: request.from.userId,
            name: request.from.userName,
            color: randomColor(),
            email: "yy@xx.zz"
          },
          userCache
        ]
      };

      return {
        block: org,
        permission: generatePermission(org, request.role, request.from.userId)
      };
    }
  },

  updateCollaborationRequest() {}
};
