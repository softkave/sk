import { Dispatch } from "redux";
import { IBlock } from "../../models/block/block";
import { IUser } from "../../models/user/user";
import { pushOperation } from "./actions";
import { defaultOperationStatusTypes, makeOperationStatus } from "./operation";

function makeBlockOperationID(block: IBlock) {
  return `block-${block.type}-${block.customId}`;
}

export async function loadRootBlocksOperation(dispatch: Dispatch, user: IUser) {
  dispatch(
    pushOperation(
      loadRootBlocksOperation.operationID,
      makeOperationStatus(defaultOperationStatusTypes.operationStarted)
    )
  );
}

loadRootBlocksOperation.operationID = "loadBlocksOperation";

export async function addBlockOperation() {}

export async function updateBlockOperation() {}

export async function toggleTaskOperation() {}

export async function deleteTaskOperation() {}

export async function addCollaboratorsOperation() {}

export async function getBlockOperation() {}

export async function getBlockChildrenOperation() {}

export async function getBlockCollaboratorsOperation() {}

export async function getBlockCollaborationRequestsOperation() {}

export async function transferBlockOperation() {}
