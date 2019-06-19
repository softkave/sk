import auth from "./auth";
import {
  addBlockMutation,
  updateBlockMutation,
  deleteBlockMutation,
  getBlockChildrenQuery,
  addCollaboratorsMutation,
  getCollabRequestsQuery,
  getCollaboratorsQuery,
  getRoleBlocksQuery,
  removeCollaboratorMutation,
  toggleTaskMutation,
  revokeRequestMutation,
  dragAndDropMutation
} from "./schema/block";
import { getDataFromObj } from "../utils/object";

const blockParamFields = ["customId"];

export function addBlock(block) {
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
    "position",
    "positionTimestamp",
    "tasks",
    "groups",
    "projects",
    "groupTaskContext",
    "groupProjectContext"
  ];

  return auth(
    null,
    addBlockMutation,
    { block: getDataFromObj(block, fields) },
    "data.block.addBlock"
  );
}

export function updateBlock(block, data) {
  const dataFields = [
    "name",
    "description",
    "expectedEndAt",
    "completedAt",
    "color",
    "priority",
    "data",
    "taskCollaborators",
    "position",
    "positionTimestamp",
    "parents",
    "tasks",
    "groups",
    "projects",
    "groupTaskContext",
    "groupProjectContext"
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
}

export function deleteBlock(block) {
  return auth(
    null,
    deleteBlockMutation,
    { block: getDataFromObj(block, blockParamFields) },
    "data.block.deleteBlock"
  );
}

export function getBlockChildren(block, types) {
  return auth(
    null,
    getBlockChildrenQuery,
    { types, block: getDataFromObj(block, blockParamFields) },
    "data.block.getBlockChildren"
  );
}

export function addCollaborators(block, collaborators) {
  const collaboratorFields = ["email", "body", "expiresAt", "customId"];
  return auth(
    null,
    addCollaboratorsMutation,
    {
      block: getDataFromObj(block, blockParamFields),
      collaborators: collaborators.map(c =>
        getDataFromObj(c, collaboratorFields)
      )
    },
    "data.block.addCollaborators"
  );
}

export function removeCollaborator(block, collaborator) {
  return auth(
    null,
    removeCollaboratorMutation,
    {
      block: getDataFromObj(block, blockParamFields),
      collaborator: collaborator.customId
    },
    "data.block.removeCollaborator"
  );
}

export function getCollaborators(block) {
  return auth(
    null,
    getCollaboratorsQuery,
    {
      block: getDataFromObj(block, blockParamFields)
    },
    "data.block.getCollaborators"
  );
}

export function getCollabRequests(block) {
  return auth(
    null,
    getCollabRequestsQuery,
    {
      block: getDataFromObj(block, blockParamFields)
    },
    "data.block.getCollabRequests"
  );
}

export function getRoleBlocks() {
  return auth(null, getRoleBlocksQuery, {}, "data.block.getRoleBlocks");
}

export function toggleTask(block, data) {
  return auth(
    null,
    toggleTaskMutation,
    {
      data,
      block: getDataFromObj(block, blockParamFields)
    },
    "data.block.toggleTask"
  );
}

export function revokeRequest(block, request) {
  return auth(
    null,
    revokeRequestMutation,
    {
      request: request.customId,
      block: getDataFromObj(block, blockParamFields)
    },
    "data.block.revokeRequest"
  );
}

export function dragAndDrop(
  sourceBlock,
  draggedBlock,
  destinationBlock,
  dropPosition,
  blockPosition,
  draggedBlockType,
  groupContext
) {
  return auth(
    null,
    dragAndDropMutation,
    {
      dropPosition,
      blockPosition,
      draggedBlockType,
      groupContext,
      sourceBlock: getDataFromObj(sourceBlock, blockParamFields),
      draggedBlock: getDataFromObj(draggedBlock, blockParamFields),
      destinationBlock: getDataFromObj(destinationBlock, blockParamFields)
    },
    "data.block.dragAndDrop"
  );
}
