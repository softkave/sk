export function canPerformAction(block, permission, action) {
  if (block) {
    action = action.toUpperCase();
    console.log(block, permission, action);
    const acl = block.acl;

    if (acl) {
      const actionData = acl.find(item => {
        return item.action === action;
      });

      console.log(actionData);

      if (actionData && permission) {
        return !!actionData.roles.find(role => {
          return role === permission.role;
        });
      }
    }
  }

  return false;
}

export function getClosestPermissionToBlock(permissions, block) {
  if (block) {
    const blockId = block._id || block.id;
    let permission = permissions.find(permission => {
      let parents = block.parents || [];
      let ids = [blockId].concat([...parents].reverse());
      return !!ids.find(id => {
        return permission.blockId === id;
      });
      // return permission.blockId === blockId;
    });

    return permission;
  }

  return null;
}
