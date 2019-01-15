import { defaultRolesMap, getDefaultRolesArr } from "./roles";

const basicPrefixList = [
  { action: "create", level: defaultRolesMap.lead },
  { action: "update", level: defaultRolesMap.lead },
  { action: "read", level: defaultRolesMap.collaborator },
  { action: "delete", level: defaultRolesMap.lead }
];

const defaultRolesArr = getDefaultRolesArr();
export const blockActionTypes = [
  {
    type: "task",
    prefixList: [
      ...basicPrefixList,
      { action: "toggle", level: defaultRolesMap.collaborator },
      { action: "assign", level: defaultRolesMap.lead },
      { action: "unassign", level: defaultRolesMap.lead }
    ]
  },
  { type: "group", prefixList: basicPrefixList },
  { type: "project", prefixList: basicPrefixList },
  { type: "org", prefixList: basicPrefixList },
  {
    type: "collaboration_request",
    prefixList: [{ action: "read", level: defaultRolesMap.lead }]
  },
  {
    type: "roles",
    prefixList: [
      { action: "create", level: defaultRolesMap.admin },
      { action: "update", level: defaultRolesMap.admin },
      { action: "delete", level: defaultRolesMap.admin }
    ]
  },
  {
    type: "acl",
    prefixList: [{ action: "update", level: defaultRolesMap.admin }]
  }
];

export function generateRolesActions(roles) {
  return roles.map(({ role, level }, i) => {
    const actionMinLevel = i === defaultRolesArr.length - 1 ? level : level + 1;
    return {
      type: `collaborator_${role}`,
      prefixList: [
        {
          action: "add",
          level: actionMinLevel
        },
        {
          action: "remove",
          level: actionMinLevel
        }
      ]
    };
  });
}

export function generateACL(types, actionsOnly) {
  return types.reduce((actions, { type, prefixList }) => {
    //console.log(actions);
    prefixList.forEach(({ action, level }) => {
      let prefixedAction = `${action}_${type}`.toUpperCase();
      if (actionsOnly) {
        actions.push(prefixedAction);
      } else {
        actions.push({ level, action: prefixedAction });
      }
    });

    return actions;
  }, []);
}

export function generateBlockPermission(block, userPermissions) {
  if (!block.acl || !Array.isArray(block.acl) || block.acl.length < 1) {
    return null;
  }

  const blockPermission = userPermissions.find(
    permission => permission.blockId === block.owner
  );

  if (!blockPermission) {
    return null;
  }

  let permission = {};
  block.acl.forEach(action => {
    let actionPath = action.action.split("_");
    let crudType = actionPath[0].toLowerCase();
    let actionCategory = actionPath[1].toLowerCase();
    let params =
      actionPath.length > 2
        ? actionPath.slice(2).map(p => p.toLowerCase())
        : null;

    if (blockPermission.level >= action.level) {
      let permissionCategory = permission[actionCategory];
      if (permissionCategory) {
        permissionCategory[crudType] = params || true;
      } else {
        permission[actionCategory] = { [crudType]: params || true };
      }
    }
  });

  return permission;
}
