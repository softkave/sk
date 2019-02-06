import { defaultRolesMap } from "./roles";
import dotProp from "dot-prop-immutable";

const basicPrefixList = [
  { action: "create", level: defaultRolesMap.lead },
  { action: "update", level: defaultRolesMap.lead },
  { action: "read", level: defaultRolesMap.collaborator },
  { action: "delete", level: defaultRolesMap.lead }
];

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
    type: "collaboration",
    prefixList: [
      { action: "read-requests", level: defaultRolesMap.lead },
      { action: "send-request", level: defaultRolesMap.admin },
      { action: "update-user-role", level: defaultRolesMap.admin }
    ]
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
  return roles.map(({ label, level }, i) => {
    const actionMinLevel = i === roles.length - 1 ? level : level + 1;
    return {
      type: `collaborator_${label}`,
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

export function generateACL(types, actionsOnly, filter = () => true) {
  return types.reduce((actions, { type, prefixList }) => {
    prefixList.forEach(({ action, level }) => {
      if (filter({ action, level, type })) {
        let prefixedAction = `${action}_${type}`.toUpperCase();
        if (actionsOnly) {
          actions.push(prefixedAction);
        } else {
          actions.push({ level, action: prefixedAction });
        }
      }
    });

    return actions;
  }, []);
}

export function generateACLArrayFromObj(aclObj) {
  let aclArr = [];

  Object.keys(aclObj).forEach(resourceType => {
    let actions = aclObj[resourceType];

    Object.keys(actions).forEach(action => {
      let actionData = actions[action];
      let params = actionData.params || [];
      let actionStr = [action, resourceType, ...params].join("_").toUpperCase();
      let actionObj = { action: actionStr, level: actionData.level };
      aclArr.push(actionObj);
    });
  });

  return aclArr;
}

export function generateBlockPermission(block, userPermissions) {
  if (!block.acl || !Array.isArray(block.acl) || block.acl.length < 1) {
    return null;
  }

  let blockPermission = null;
  if (userPermissions) {
    blockPermission = userPermissions.find(
      permission => permission.blockId === block.owner
    );
  }

  // if (!blockPermission) {
  //   return null;
  // }

  let permission = {};
  block.acl.forEach(action => {
    let actionPath = action.action.split("_");
    let crudType = actionPath[0].toLowerCase();
    let actionCategory = actionPath[1].toLowerCase();
    let params =
      actionPath.length > 2
        ? actionPath.slice(2).map(p => p.toLowerCase())
        : null;

    let actionCategoryObj = permission[actionCategory];
    let entry = {
      params,
      level: action.level,
      canPerformAction: blockPermission
        ? blockPermission.level >= action.level
        : null
    };

    if (actionCategoryObj) {
      actionCategoryObj[crudType] = entry;
    } else {
      permission[actionCategory] = {
        [crudType]: entry
      };
    }
  });

  return permission;
}

const resourceHierachy = {
  org: 2,
  project: 1,
  task: 0
};

export function makeHierachyFilter(resourceType, groupParentType) {
  return function filterHierachy({ type, action, level }) {
    if (
      (resourceHierachy[resourceType] || resourceHierachy[groupParentType]) <
      resourceHierachy[type]
    ) {
      return false;
    }
    // else if (
    //   resourceType === type &&
    //   (action === "create" || action === "add")
    // ) {
    //   return false;
    // }

    return true;
  };
}

export function canPerformAction(permission, resourceType, action) {
  return dotProp.get(permission, `${resourceType}.${action}.canPerformAction`);
}
