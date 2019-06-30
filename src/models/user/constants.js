const constants = {
  minNameLength: 1,
  maxNameLength: 300,
  minPasswordLength: 5,
  maxPasswordLength: 20
};

const userFieldNames = {
  customId: "customId",
  name: "name",
  email: "email",
  createdAt: "createdAt",
  lastNotificationCheckTime: "lastNotificationCheckTime",
  rootBlockId: "rootBlockId",
  orgs: "orgs",
  color: "color"
};

module.exports = { constants, userFieldNames };
