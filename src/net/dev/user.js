import {
  generateACL,
  blockActionTypes,
  generateRolesActions
} from "../../models/block/acl";
import { getPersonalRolesArr } from "../../models/block/roles";
import { generatePermission } from "../../models/block/permission";
import { orgActions } from "../../models/block/actions";

//const uuid = require("uuid/v4");
const nanoid = require("nanoid");
const randomColor = require("randomcolor");
let rootBlock = null;
let userCache = null;

module.exports = {
  signup(user) {
    const userId = nanoid();
    const rootBlockId = nanoid();
    const rootBlockRoles = getPersonalRolesArr();
    const rootBlockAcl = orgActions;

    rootBlock = {
      id: rootBlockId,
      type: "root",
      name: `root_${user.name}`,
      color: randomColor(),
      owner: rootBlockId,
      createdBy: userId,
      acl: rootBlockAcl,
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
    sessionStorage.setItem("rootBlock-dev", JSON.stringify(rootBlock));
    sessionStorage.setItem("user-data-dev", JSON.stringify(generatedUserData));
    sessionStorage.setItem("user-token-dev", JSON.stringify(token));

    return {
      token,
      user: generatedUserData
    };
  },

  login(user) {
    return this.signup({
      ...user,
      name: "Abayomi Akintomide"
    });
  },

  logout() {
    sessionStorage.removeItem("user-token-dev");
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

  updateCollaborationRequest() {},

  getDataWithToken() {},

  getSavedUserData() {
    let user = sessionStorage.getItem("user-data-dev");
    let token = sessionStorage.getItem("user-token-dev");

    if (user && token) {
      return { token, user: JSON.parse(user) };
    }
  }
};
