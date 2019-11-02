import { Dispatch } from "redux";
import { IBlock } from "../../models/block/block";
import { IUser } from "../../models/user/user";
import addBlockOperationFunc from "../../redux/operations/block/addBlock";
import addCollaboratorsOperationFunc from "../../redux/operations/block/addCollaborators";
import deleteBlockOperation from "../../redux/operations/block/deleteBlock";
import loadBlockChildrenOperationFunc from "../../redux/operations/block/loadBlockChildren";
import loadBlockCollaborationRequestsOperationFunc from "../../redux/operations/block/loadBlockCollaborationRequests";
import loadBlockCollaboratorsOperationFunc from "../../redux/operations/block/loadBlockCollaborators";
import loadRootBlocksOperationFunc from "../../redux/operations/block/loadRootBlock";
import toggleTaskOperationFunc from "../../redux/operations/block/toggleTask";
import updateBlockOperationFunc from "../../redux/operations/block/updateBlock";
import { IReduxState } from "../../redux/store";
import { IAddCollaboratorFormItemValues } from "../collaborator/AddCollaboratorFormItem";

export type IBlockMethods = ReturnType<typeof getBlockMethods>;

export interface IGetBlockMethodsParams {
  dispatch: Dispatch;
  state: IReduxState;
}

export function getBlockMethods(state: IReduxState, dispatch: Dispatch) {
  return {
    async onAdd(user: IUser, block: IBlock, parent?: IBlock) {
      return addBlockOperationFunc(state, dispatch, user, block, parent);
    },

    async onUpdate(block: IBlock, data: Partial<IBlock>) {
      return updateBlockOperationFunc(state, dispatch, block, data);
    },

    async onToggle(user: IUser, block: IBlock) {
      return toggleTaskOperationFunc(state, dispatch, user, block);
    },

    async onDelete(block: IBlock) {
      return deleteBlockOperation(state, dispatch, block);
    },

    async onAddCollaborators(
      block: IBlock,

      // TODO: This is wrong, better declare type
      requests: IAddCollaboratorFormItemValues[],
      message?: string,
      expiresAt?: number | Date
    ) {
      return addCollaboratorsOperationFunc(
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
      return loadBlockChildrenOperationFunc(
        state,
        dispatch,
        block,
        types,
        isBacklog
      );
    },

    async loadCollaborators(block: IBlock) {
      return loadBlockCollaboratorsOperationFunc(state, dispatch, block);
    },

    async loadCollaborationRequests(block: IBlock) {
      return loadBlockCollaborationRequestsOperationFunc(
        state,
        dispatch,
        block
      );
    },

    async loadRootData() {
      return loadRootBlocksOperationFunc(state, dispatch);
    }
  };
}
