import { IAddCollaboratorFormItemValues } from "../components/collaborator/AddCollaboratorFormItem";
import { BlockType, IBlock } from "../models/block/block";
import { INotification } from "../models/notification/notification";
import { IUser } from "../models/user/user";
import { getDataFromObject } from "../utils/object";
import auth from "./auth";
import {
  addBlockMutation,
  addCollaboratorsMutation,
  deleteBlockMutation,
  getBlockChildrenQuery,
  getBlocksWithCustomIDsQuery,
  getCollaboratorsQuery,
  getCollabRequestsQuery,
  getRootBlocksQuery,
  getTasksAssignedToUserQuery,
  removeCollaboratorMutation,
  revokeRequestMutation,
  transferBlockMutation,
  updateBlockMutation
} from "./schema/block";

export function addBlock(block: IBlock) {
  // TODO: Find a way to define central structures that'll be used by server and client, including
  // mongo schemas, graphql schemas, extract functions, and other places.
  // TODO: define the type of the arguments, so that we can avoid using fields
  const fields = [
    "name",
    "customId",
    "description",
    "expectedEndAt",
    "color",
    "type",
    "parent",
    "rootBlockID",
    "priority",
    "taskCollaborationData",
    "taskCollaborators",
    "subTasks",
    "groups",
    "projects",
    "tasks",
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

export function updateBlock(block: IBlock, data: Partial<IBlock>) {
  const dataFields = [
    "name",
    "description",
    "expectedEndAt",
    "color",
    "priority",
    "taskCollaborationData",
    "taskCollaborators",
    "parent",
    "groups",
    "projects",
    "tasks",
    "groupTaskContext",
    "groupProjectContext",
    "subTasks"
  ];

  return auth(
    null,
    updateBlockMutation,
    {
      customId: block.customId,
      data: getDataFromObject(data, dataFields)
    },
    "data.block.updateBlock"
  );
}

export function deleteBlock(block: IBlock) {
  return auth(
    null,
    deleteBlockMutation,
    { customId: block.customId },
    "data.block.deleteBlock"
  );
}

export function getBlockChildren(block: IBlock, typeList?: BlockType[]) {
  return auth(
    null,
    getBlockChildrenQuery,
    { typeList, customId: block.customId },
    "data.block.getBlockChildren"
  );
}

export function addCollaborators(
  block: IBlock,
  collaborators: IAddCollaboratorFormItemValues[]
) {
  const collaboratorFields = ["email", "body", "expiresAt", "customId"];
  return auth(
    null,
    addCollaboratorsMutation,
    {
      customId: block.customId,
      collaborators: collaborators.map(request =>
        getDataFromObject(request, collaboratorFields)
      )
    },
    "data.block.addCollaborators"
  );
}

export function removeCollaborator(block: IBlock, collaborator: IUser) {
  return auth(
    null,
    removeCollaboratorMutation,
    {
      customId: block.customId,
      collaborator: collaborator.customId
    },
    "data.block.removeCollaborator"
  );
}

export function getCollaborators(block: IBlock) {
  return auth(
    null,
    getCollaboratorsQuery,
    {
      customId: block.customId
    },
    "data.block.getBlockCollaborators"
  );
}

export function getCollabRequests(block: IBlock) {
  return auth(
    null,
    getCollabRequestsQuery,
    {
      customId: block.customId
    },
    "data.block.getBlockCollaborationRequests"
  );
}

export function getRootBlocks() {
  return auth(null, getRootBlocksQuery, {}, "data.block.getRootBlocks");
}

// export function toggleTask({ block, data }) {
//   return auth(
//     null,
//     toggleTaskMutation,
//     {
//       data,
//       customId: block.customId
//     },
//     "data.block.toggleTask"
//   );
// }

export function revokeRequest(block: IBlock, request: INotification) {
  return auth(
    null,
    revokeRequestMutation,
    {
      request: request.customId,
      customId: block.customId
    },
    "data.block.revokeCollaborationRequest"
  );
}

export function transferBlock(
  sourceBlock: IBlock,
  draggedBlock: IBlock,
  destinationBlock: IBlock,
  dropPosition?: number,
  groupContext?: "task" | "project"
) {
  return auth(
    null,
    transferBlockMutation,
    {
      dropPosition,
      groupContext,
      sourceBlock: sourceBlock.customId,
      draggedBlock: draggedBlock.customId,
      destinationBlock: destinationBlock.customId
    },
    "data.block.transferBlock"
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

export function getBlocksWithCustomIDs(customIds: string[]) {
  return auth(
    null,
    getBlocksWithCustomIDsQuery,
    { customIds },
    "data.block.getBlocksWithCustomIDs"
  );
}
