import values from "lodash/values";

export const roles = ["admin", "lead", "collaborator"];

function mergeActions(...actions) {
  let cache = {};

  actions.forEach((acts = []) => {
    acts.forEach(action => {
      cache[action.action] = action;
    });
  });

  return values(cache);
}

const aclActions = [
  {
    action: "UPDATE_ACL",
    roles: [...roles]
  }
];

const collaborationActions = [
  {
    action: "SEND_REQUEST",
    roles: [...roles]
  },
  {
    action: "UPDATE_REQUEST",
    roles: [...roles]
  },
  {
    action: "READ_REQUESTS",
    roles: [...roles]
  },
  {
    action: "REVOKE_REQUEST",
    roles: [...roles]
  },
  {
    action: "REMOVE_COLLABORATOR",
    roles: [...roles]
  },
  {
    action: "READ_BENCH",
    roles: [...roles]
  },
  {
    action: "UPDATE_ROLES",
    roles: [...roles]
  },
  {
    action: "ASSIGN_ROLE",
    roles: [...roles]
  },
  {
    action: "REVOKE_ROLE",
    roles: [...roles]
  }
];

const taskOwnActions = [
  {
    action: "CREATE_TASK",
    roles: [...roles]
  },
  {
    action: "TOGGLE_TASK",
    roles: [...roles]
  },
  {
    action: "ASSIGN_TASK",
    roles: [...roles]
  },
  {
    action: "UNASSIGN_TASK",
    roles: [...roles]
  },
  {
    action: "READ_TASK",
    roles: [...roles]
  },
  {
    action: "UPDATE_TASK",
    roles: [...roles]
  },
  {
    action: "DELETE_TASK",
    roles: [...roles]
  }
];

export const taskActions = mergeActions(aclActions, taskOwnActions);

const projectOwnActions = [
  {
    action: "CREATE_GROUP",
    roles: [...roles]
  },
  {
    action: "READ_GROUP",
    roles: [...roles]
  },
  {
    action: "DELETE_GROUP",
    roles: [...roles]
  },
  {
    action: "UPDATE_GROUP",
    roles: [...roles]
  },
  {
    action: "CREATE_PROJECT",
    roles: [...roles]
  },
  {
    action: "READ_PROJECT",
    roles: [...roles]
  },
  {
    action: "DELETE_PROJECT",
    roles: [...roles]
  },
  {
    action: "UPDATE_PROJECT",
    roles: [...roles]
  }
];

export const projectActions = mergeActions(taskActions, projectOwnActions);
export const groupActions = projectActions;

const orgOwnActions = [
  {
    action: "CREATE_ORG",
    roles: [...roles]
  },
  {
    action: "UPDATE_ORG",
    roles: [...roles]
  },
  {
    action: "DELETE_ORG",
    roles: [...roles]
  },
  {
    action: "READ_ORG",
    roles: [...roles]
  }
];

export const orgActions = mergeActions(
  groupActions,
  collaborationActions,
  orgOwnActions
);

export function getBlockActionsObject(block) {
  let typeActions =
    block.type === "project"
      ? projectActions
      : block.type === "group"
      ? groupActions
      : block.type === "task"
      ? taskActions
      : orgActions;

  let actions = typeActions.reduce((actions, item) => {
    actions[item.action] = true;
    return actions;
  }, {});

  return actions;
}

export function getBlockActionsFromParent(block, parent) {
  let actions = getBlockActionsObject(block);
  let acl = parent.acl.filter(item => {
    return actions[item.action];
  });

  return acl;
}
