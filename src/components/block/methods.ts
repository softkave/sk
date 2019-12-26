import { Dispatch } from "redux";
import addBlockOperationFunc, {
  IAddBlockOperationFuncDataProps
} from "../../redux/operations/block/addBlock";
import addCollaboratorsOperationFunc, {
  IAddCollaboratorOperationFuncDataProps
} from "../../redux/operations/block/addCollaborators";
import deleteBlockOperation, {
  IDeleteBlockOperationFuncDataProps
} from "../../redux/operations/block/deleteBlock";
import loadBlockChildrenOperationFunc, {
  ILoadBlockChildrenOperationFuncDataProps
} from "../../redux/operations/block/loadBlockChildren";
import loadBlockCollaborationRequestsOperationFunc, {
  ILoadBlockCollaborationRequestsOperationFuncDataProps
} from "../../redux/operations/block/loadBlockCollaborationRequests";
import loadBlockCollaboratorsOperationFunc, {
  ILoadBlockCollaboratorsOperationFuncDataProps
} from "../../redux/operations/block/loadBlockCollaborators";
import loadRootBlocksOperationFunc from "../../redux/operations/block/loadRootBlocks";
import toggleTaskOperationFunc, {
  IToggleTaskOperationFuncDataProps
} from "../../redux/operations/block/toggleTask";
import updateBlockOperationFunc, {
  IUpdateBlockOperationFuncDataProps
} from "../../redux/operations/block/updateBlock";
import { IOperationFuncOptions } from "../../redux/operations/operation";
import { IReduxState } from "../../redux/store";

export type IBlockMethods = ReturnType<typeof getBlockMethods>;

export interface IGetBlockMethodsParams {
  dispatch: Dispatch;
  state: IReduxState;
}

export function getBlockMethods(state: IReduxState, dispatch: Dispatch) {
  return {
    async onAdd(
      props: IAddBlockOperationFuncDataProps,
      options: IOperationFuncOptions = {}
    ) {
      return addBlockOperationFunc(props, options);
    },

    async onUpdate(
      props: IUpdateBlockOperationFuncDataProps,
      options: IOperationFuncOptions = {}
    ) {
      return updateBlockOperationFunc(props, options);
    },

    async onToggle(
      props: IToggleTaskOperationFuncDataProps,
      options: IOperationFuncOptions = {}
    ) {
      return toggleTaskOperationFunc(state, dispatch, props, options);
    },

    async onDelete(
      props: IDeleteBlockOperationFuncDataProps,
      options: IOperationFuncOptions = {}
    ) {
      return deleteBlockOperation(state, dispatch, props, options);
    },

    async onAddCollaborators(
      props: IAddCollaboratorOperationFuncDataProps,
      options: IOperationFuncOptions = {}
    ) {
      return addCollaboratorsOperationFunc(state, dispatch, props, options);
    },

    async loadBlockChildren(
      props: ILoadBlockChildrenOperationFuncDataProps,
      options: IOperationFuncOptions = {}
    ) {
      return loadBlockChildrenOperationFunc(props, options);
    },

    async loadCollaborators(
      props: ILoadBlockCollaboratorsOperationFuncDataProps,
      options: IOperationFuncOptions = {}
    ) {
      return loadBlockCollaboratorsOperationFunc(
        state,
        dispatch,
        props,
        options
      );
    },

    async loadCollaborationRequests(
      props: ILoadBlockCollaborationRequestsOperationFuncDataProps,
      options: IOperationFuncOptions = {}
    ) {
      return loadBlockCollaborationRequestsOperationFunc(
        state,
        dispatch,
        props,
        options
      );
    },

    async loadRootData() {
      return loadRootBlocksOperationFunc();
    }
  };
}
