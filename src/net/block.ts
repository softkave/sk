import { getDataFromObject } from "../utils/object";
import auth from "./auth";
import {
  addBlockMutation,
  addCollaboratorsMutation,
  assignRoleMutation,
  deleteBlockMutation,
  getBlockChildrenQuery,
  getBlocksWithCustomIDsQuery,
  getCollaboratorsQuery,
  getCollabRequestsQuery,
  getRoleBlocksQuery,
  getTasksAssignedToUserQuery,
  removeCollaboratorMutation,
  revokeRequestMutation,
  toggleTaskMutation,
  transferBlockMutation,
  updateAccessControlDataMutation,
  updateBlockMutation,
  updateRolesMutation
} from "./schema/block";

const blockParamFields = ["customId"];

export function addBlock({ block }) {
  // TODO: Find a way to define central structures that'll be used by server and client, including
  // mongo schemas, graphql schemas, extract functions, and other places.
  const fields = [
    "name",
    "customId",
    "description",
    "expectedEndAt",
    "completedAt",
    "color",
    "type",
    "parents",
    "data",
    "priority",
    "taskCollaborators",
    "tasks",
    "groups",
    "projects",
    "groupTaskContext",
    "groupProjectContext"
  ];

  return auth(
    null,
    addBlockMutation,
    { block: getDataFromObject(block, fields) },
    "data.block.addBlock"
  );
}

export function updateBlock({ block, data }) {
  const dataFields = [
    "name",
    "description",
    "expectedEndAt",
    "completedAt",
    "color",
    "priority",
    "data",
    "taskCollaborators",
    "parents",
    "tasks",
    "groups",
    "projects",
    "groupTaskContext",
    "groupProjectContext"
  ];

  console.log({ data });

  return auth(
    null,
    updateBlockMutation,
    {
      block: getDataFromObject(block, blockParamFields),
      data: getDataFromObject(data, dataFields)
    },
    "data.block.updateBlock"
  );
}

export function deleteBlock({ block }) {
  return auth(
    null,
    deleteBlockMutation,
    { block: getDataFromObject(block, blockParamFields) },
    "data.block.deleteBlock"
  );
}

export function getBlockChildren({ block, types, isBacklog }) {
  return auth(
    null,
    getBlockChildrenQuery,
    { types, block: getDataFromObject(block, blockParamFields), isBacklog },
    "data.block.getBlockChildren"
  );
}

export function addCollaborators({ block, collaborators }) {
  const collaboratorFields = ["email", "body", "expiresAt", "customId"];
  return auth(
    null,
    addCollaboratorsMutation,
    {
      block: getDataFromObject(block, blockParamFields),
      collaborators: collaborators.map(request =>
        getDataFromObject(request, collaboratorFields)
      )
    },
    "data.block.addCollaborators"
  );
}

export function removeCollaborator({ block, collaborator }) {
  return auth(
    null,
    removeCollaboratorMutation,
    {
      block: getDataFromObject(block, blockParamFields),
      collaborator: collaborator.customId
    },
    "data.block.removeCollaborator"
  );
}

export function getCollaborators({ block }) {
  return auth(
    null,
    getCollaboratorsQuery,
    {
      block: getDataFromObject(block, blockParamFields)
    },
    "data.block.getCollaborators"
  );
}

export function getCollabRequests({ block }) {
  return auth(
    null,
    getCollabRequestsQuery,
    {
      block: getDataFromObject(block, blockParamFields)
    },
    "data.block.getCollabRequests"
  );
}

export function getRoleBlocks() {
  return auth(null, getRoleBlocksQuery, {}, "data.block.getRoleBlocks");
}

export function toggleTask({ block, data }) {
  return auth(
    null,
    toggleTaskMutation,
    {
      data,
      block: getDataFromObject(block, blockParamFields)
    },
    "data.block.toggleTask"
  );
}

export function revokeRequest({ block, request }) {
  return auth(
    null,
    revokeRequestMutation,
    {
      request: request.customId,
      block: getDataFromObject(block, blockParamFields)
    },
    "data.block.revokeRequest"
  );
}

export function transferBlock({
  sourceBlock,
  draggedBlock,
  destinationBlock,
  dropPosition,
  blockPosition,
  draggedBlockType,
  groupContext
}) {
  return auth(
    null,
    transferBlockMutation,
    {
      dropPosition,
      blockPosition,
      draggedBlockType,
      groupContext,
      sourceBlock: getDataFromObject(sourceBlock, blockParamFields),
      draggedBlock: getDataFromObject(draggedBlock, blockParamFields),
      destinationBlock: getDataFromObject(destinationBlock, blockParamFields)
    },
    "data.block.transferBlock"
  );
}

export function updateAccessControlData({ block, accessControlData }) {
  return auth(
    null,
    updateAccessControlDataMutation,
    {
      accessControlData: getDataFromObject(accessControlData, [
        "orgId",
        "actionName",
        "permittedRoles"
      ]),
      block: getDataFromObject(block, blockParamFields)
    },
    "data.block.updateAccessControlData"
  );
}

export function updateRoles({ block, roles }) {
  return auth(
    null,
    updateRolesMutation,
    {
      roles,
      block: getDataFromObject(block, blockParamFields)
    },
    "data.block.updateRoles"
  );
}

export function assignRole({ block, collaborator, roleName }) {
  return auth(
    null,
    assignRoleMutation,
    {
      collaborator,
      roleName,
      block: getDataFromObject(block, blockParamFields)
    },
    "data.block.assignRole"
  );
}

export function getTasksAssignedToUser() {
  return auth(
    null,
    getTasksAssignedToUserQuery,
    {},
    "data.block.getAssignedTasks"
  );
}

export function getBlocksWithCustomIDs(props: { customIDs: string[] }) {
  return auth(
    null,
    getBlocksWithCustomIDsQuery,
    { customIDs: props.customIDs },
    "data.block.getBlocksWithCustomIDs"
  );
}
