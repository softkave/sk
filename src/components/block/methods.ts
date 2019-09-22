import { Dispatch } from "redux";

import { IBlock } from "../../models/block/block";
import { IUser } from "../../models/user/user";
import addBlockOperation from "../../redux/operations/block/addBlock";
import addCollaboratorsOperation from "../../redux/operations/block/addCollaborators";
import deleteBlockOperation from "../../redux/operations/block/deleteBlock";
import loadBlockChildrenOperation from "../../redux/operations/block/loadBlockChildren";
import loadBlockCollaborationRequestsOperation from "../../redux/operations/block/loadBlockCollaborationRequests";
import loadBlockCollaboratorsOperation from "../../redux/operations/block/loadBlockCollaborators";
import loadRootBlocksOperation from "../../redux/operations/block/loadRootBlock";
import toggleTaskOperation from "../../redux/operations/block/toggleTask";
import updateBlockOperation from "../../redux/operations/block/updateBlock";
import { IReduxState } from "../../redux/store";
import { IACFItemValue } from "../collaborator/ACFItem";

export interface IBlockMethods {
  onAdd: (
    user: IUser,
    block: Partial<IBlock>,
    parent?: IBlock
  ) => Promise<void>;
  onUpdate: (block: IBlock, data: Partial<IBlock>) => Promise<void>;
  onToggle: (user: IUser, block: IBlock) => Promise<void>;
  onDelete: (block: IBlock) => Promise<void>;
  onAddCollaborators: (
    block: IBlock,

    // TODO: This is wrong, better declare type
    requests: IACFItemValue[],
    message?: string,
    expiresAt?: number | Date
  ) => Promise<void>;
  loadBlockChildren: (
    block: IBlock,
    types?: string[],
    isBacklog?: boolean
  ) => Promise<void>;
  loadCollaborators: (block: IBlock) => Promise<void>;
  loadCollaborationRequests: (block: IBlock) => Promise<void>;
  loadRootData: () => Promise<void>;
}

export interface IGetBlockMethodsParams {
  dispatch: Dispatch;
  state: IReduxState;
}

export function getBlockMethods(
  state: IReduxState,
  dispatch: Dispatch
): IBlockMethods {
  return {
    async onAdd(user: IUser, block: Partial<IBlock>, parent?: IBlock) {
      return addBlockOperation(state, dispatch, user, block, parent);
    },

    async onUpdate(block: IBlock, data: Partial<IBlock>) {
      return updateBlockOperation(state, dispatch, block, data);
    },

    async onToggle(user: IUser, block: IBlock) {
      return toggleTaskOperation(state, dispatch, user, block);
    },

    async onDelete(block: IBlock) {
      return deleteBlockOperation(state, dispatch, block);
    },

    async onAddCollaborators(
      block: IBlock,

      // TODO: This is wrong, better declare type
      requests: IACFItemValue[],
      message?: string,
      expiresAt?: number | Date
    ) {
      return addCollaboratorsOperation(
        state,
        dispatch,
        block,
        requests,
        message,
        expiresAt
      );
    },

    async loadBlockChildren(
      block: IBlock,
      types?: string[],
      isBacklog?: boolean
    ) {
      return loadBlockChildrenOperation(
        state,
        dispatch,
        block,
        types,
        isBacklog
      );
    },

    async loadCollaborators(block: IBlock) {
      return loadBlockCollaboratorsOperation(state, dispatch, block);
    },

    async loadCollaborationRequests(block: IBlock) {
      return loadBlockCollaborationRequestsOperation(state, dispatch, block);
    },

    async loadRootData() {
      return loadRootBlocksOperation(state, dispatch);
    }
  };
}
