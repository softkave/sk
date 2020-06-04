import { BlockType, IBlock } from "../models/block/block";
import { INotification } from "../models/notification/notification";
import { IAddCollaboratorFormItemValues } from "../models/types";
import { IUser } from "../models/user/user";
import { getDataFromObject } from "../utils/object";
import auth from "./auth";
import {
  addBlockMutation,
  addCollaboratorsMutation,
  deleteBlockMutation,
  getBlockChildrenQuery,
  getRootBlocksQuery,
  removeCollaboratorMutation,
  revokeRequestMutation,
  transferBlockMutation,
  updateBlockMutation,
} from "./schema/block";

export function addBlock(block: IBlock) {
  // TODO: Find a way to define central structures that'll be used by server and client, including
  // mongo schemas, graphql schemas, extract functions, and other places.
  // TODO: define the type of the arguments, so that we can avoid using fields
  const fields = [
    "customId",
    "type",
    "name",
    "description",
    "dueAt",
    "color",
    "parent",
    "rootBlockId",
    "assignees",
    "priority",
    "subTasks",
    "boardStatuses",
    "boardLabels",
    "status",
    "statusAssignedBy",
    "statusAssignedAt",
    "labels",
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
    "color",
    "priority",
    "parent",
    "subTasks",
    "dueAt",
    "assignees",
    "boardStatuses",
    "boardLabels",
    "status",
    "statusAssignedBy",
    "statusAssignedAt",
    "labels",
  ];

  return auth(
    null,
    updateBlockMutation,
    {
      blockId: block.customId,
      data: {
        ...getDataFromObject(data, dataFields),
      },
    },
    "data.block.updateBlock"
  );
}

export function deleteBlock(block: IBlock) {
  return auth(
    null,
    deleteBlockMutation,
    { blockId: block.customId },
    "data.block.deleteBlock"
  );
}

export function getBlockChildren(block: IBlock, typeList?: BlockType[]) {
  return auth(
    null,
    getBlockChildrenQuery,
    { typeList, blockId: block.customId },
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
      blockId: block.customId,
      collaborators: collaborators.map((request) =>
        getDataFromObject(request, collaboratorFields)
      ),
    },
    "data.block.addCollaborators"
  );
}

export function removeCollaborator(block: IBlock, collaborator: IUser) {
  return auth(
    null,
    removeCollaboratorMutation,
    {
      blockId: block.customId,
      collaboratorId: collaborator.customId,
    },
    "data.block.removeCollaborator"
  );
}

export function getUserRootBlocks() {
  return auth(null, getRootBlocksQuery, {}, "data.block.getUserRootBlocks");
}

export function revokeRequest(block: IBlock, request: INotification) {
  return auth(
    null,
    revokeRequestMutation,
    {
      requestId: request.customId,
      blockId: block.customId,
    },
    "data.block.revokeCollaborationRequest"
  );
}

export function transferBlock(draggedBlock: IBlock, destinationBlock: IBlock) {
  return auth(
    null,
    transferBlockMutation,
    {
      draggedBlockId: draggedBlock.customId,
      destinationBlockId: destinationBlock.customId,
    },
    "data.block.transferBlock"
  );
}
