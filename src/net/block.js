const auth = require("./auth");
const {
  addBlockMutation,
  updateBlockMutation,
  deleteBlockMutation,
  getBlockChildrenQuery,
  getBlocksQuery,
  addCollaboratorsMutation,
  getCollabRequestsQuery,
  getCollaboratorsQuery,
  getPermissionBlocksQuery,
  removeCollaboratorMutation,
  toggleTaskMutation,
  updateRolesMutation,
  updateAclMutation,
  revokeRequestMutation,
  assignRoleMutation
} = require("./schema/block");
const { getDataFromObj } = require("../utils/object");

const blockParamFields = ["id"];
const roleFields = ["role", "level"];

module.exports = {
  addBlock(block) {
    const fields = [
      "name",
      "id",
      "description",
      "expectedEndAt",
      "completedAt",
      "color",
      "type",
      "parents",
      "data",
      "acl",
      "roles",
      "permission",
      "priority",
      "taskCollaborators"
    ];

    return auth(
      null,
      addBlockMutation,
      { block: getDataFromObj(block, fields) },
      "data.block.addBlock"
    );
  },

  updateBlock(block, data) {
    const dataFields = [
      "name",
      "description",
      "expectedEndAt",
      "completedAt",
      "color",
      "priority",
      "data",
      "acl",
      "roles",
      "taskCollaborators"
    ];

    return auth(
      null,
      updateBlockMutation,
      {
        block: getDataFromObj(block, blockParamFields),
        data: getDataFromObj(data, dataFields)
      },
      "data.block.updateBlock"
    );
  },

  deleteBlock(block) {
    return auth(
      null,
      deleteBlockMutation,
      { block: getDataFromObj(block, blockParamFields) },
      "data.block.deleteBlock"
    );
  },

  getBlocks(blocks) {
    return auth(
      null,
      getBlocksQuery,
      { blocks: blocks.map(block => getDataFromObj(block, blockParamFields)) },
      "data.block.getBlocks"
    );
  },

  getBlockChildren(block, types) {
    return auth(
      null,
      getBlockChildrenQuery,
      { types, block: getDataFromObj(block, blockParamFields) },
      "data.block.getBlockChildren"
    );
  },

  addCollaborators(block, collaborators, body, expiresAt) {
    const collaboratorFields = ["email", "role", "body", "expiresAt"];

    return auth(
      null,
      addCollaboratorsMutation,
      {
        body,
        expiresAt,
        block: getDataFromObj(block, blockParamFields),
        collaborators: collaborators.map(c =>
          getDataFromObj(c, collaboratorFields)
        )
      },
      "data.block.addCollaborators"
    );
  },

  removeCollaborator(block, collaborator) {
    return auth(
      null,
      removeCollaboratorMutation,
      {
        block: getDataFromObj(block, blockParamFields),
        collaborator: collaborator.id
      },
      "data.block.removeCollaborator"
    );
  },

  getCollaborators(block) {
    return auth(
      null,
      getCollaboratorsQuery,
      {
        block: getDataFromObj(block, blockParamFields)
      },
      "data.block.getCollaborators"
    );
  },

  getCollabRequests(block) {
    return auth(
      null,
      getCollabRequestsQuery,
      {
        block: getDataFromObj(block, blockParamFields)
      },
      "data.block.getCollabRequests"
    );
  },

  getPermissionBlocks() {
    return auth(
      null,
      getPermissionBlocksQuery,
      {},
      "data.block.getPermissionBlocks"
    );
  },

  toggleTask(block, data) {
    return auth(
      null,
      toggleTaskMutation,
      {
        data,
        block: getDataFromObj(block, blockParamFields)
      },
      "data.block.toggleTask"
    );
  },

  updateRoles(block, roles) {
    return auth(
      null,
      updateRolesMutation,
      {
        roles: roles.map(role => getDataFromObj(role, roleFields)),
        block: getDataFromObj(block, blockParamFields)
      },
      "data.block.updateRoles"
    );
  },

  updateAcl(block, acl) {
    const aclFields = ["action", "level"];

    return auth(
      null,
      updateAclMutation,
      {
        acl: acl.map(item => getDataFromObj(item, aclFields)),
        block: getDataFromObj(block, blockParamFields)
      },
      "data.block.updateAcl"
    );
  },

  revokeRequest(block, request) {
    return auth(
      null,
      revokeRequestMutation,
      {
        request: request.id,
        block: getDataFromObj(block, blockParamFields)
      },
      "data.block.revokeRequest"
    );
  },

  assignRole(block, collaborator, role) {
    return auth(
      null,
      assignRoleMutation,
      {
        collaborator: collaborator.id,
        role: getDataFromObj(role, roleFields),
        block: getDataFromObj(block, blockParamFields)
      },
      "data.block.assignRole"
    );
  }
};
