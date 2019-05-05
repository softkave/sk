//const uuid = require("uuid/v4");
import nanoid from "nanoid";
import randomColor from "randomcolor";
let rootBlock = null;
let userCache = null;

export function signup(user) {
  const userId = nanoid();
  const rootBlockId = nanoid();
  rootBlock = {
    customId: rootBlockId,
    type: "root",
    name: `root_${user.name}`,
    color: randomColor(),
    owner: rootBlockId,
    createdBy: userId
  };

  const token = "abcd";
  const generatedUserData = {
    customId: userId,
    name: user.name,
    email: user.email,
    createdAt: Date.now(),
    color: randomColor(),
    lastNotificationCheckTime: Date.now()
  };

  userCache = generatedUserData;
  sessionStorage.setItem("rootBlock-dev", JSON.stringify(rootBlock));
  sessionStorage.setItem("user-data-dev", JSON.stringify(generatedUserData));
  sessionStorage.setItem("user-token-dev", JSON.stringify(token));
  return {
    token,
    user: generatedUserData
  };
}

export function login(user) {
  return this.signup({
    ...user,
    name: "Abayomi Akintomide"
  });
}

export function logout() {
  sessionStorage.removeItem("user-token-dev");
}

export function forgotPassword() {}
export function changePassword() {}
export function userExists() {}
export function updateUser() {}
export function changePasswordWithToken() {}
export function getCollaborationRequests() {
  return [
    {
      customId: nanoid(),
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
      createdAt: Date.now()
    },
    {
      customId: nanoid(),
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
      createdAt: Date.now()
    },
    {
      customId: nanoid(),
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
      createdAt: Date.now()
    }
  ];
}

export function respondToCollaborationRequest({ request, response }) {
  if (response.toLowerCase() === "accepted") {
    let org = {
      customId: request.from.blockId,
      type: request.from.blockType,
      name: request.from.blockName,
      color: randomColor(),
      owner: request.from.blockId,
      createdBy: request.from.userId,
      collaborators: [
        userCache,
        {
          customId: request.from.userId,
          name: request.from.userName,
          color: randomColor(),
          email: "yy@xx.zz"
        }
      ]
    };

    return {
      block: org
    };
  }
}

export function updateCollaborationRequest() {}
export function getDataWithToken() {}
export function getSavedUserData() {
  let user = sessionStorage.getItem("user-data-dev");
  let token = sessionStorage.getItem("user-token-dev");
  if (user && token) {
    return { token, user: JSON.parse(user) };
  }
}
