import { Dispatch } from "redux";
import addBlockOperationFunc, {
  IAddBlockOperationFuncDataProps
} from "../../redux/operations/block/addBlock";
import addCollaboratorsOperationFunc, {
  IAddCollaboratorOperationFuncDataProps
} from "../../redux/operations/block/addCollaborators";
import deleteBlockOperationFunc, {
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
import loadRootBlocksOperationFunc from "../../redux/operations/block/loadRootBlock";
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
      return addBlockOperationFunc(state, dispatch, props, options);
    },

    async onUpdate(
      props: IUpdateBlockOperationFuncDataProps,
      options: IOperationFuncOptions = {}
    ) {
      return updateBlockOperationFunc(state, dispatch, props, options);
    },

    async onToggle(
      props: IToggleTaskOperationFuncDataProps,
      options: IOperationFuncOptions = {}
    ) {
      return toggleTaskOperationFunc(props, options);
    },

    async onDelete(
      props: IDeleteBlockOperationFuncDataProps,
      options: IOperationFuncOptions = {}
    ) {
      return deleteBlockOperationFunc(props, options);
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
      return loadBlockChildrenOperationFunc(state, dispatch, props, options);
    },

    async loadCollaborators(
      props: ILoadBlockCollaboratorsOperationFuncDataProps,
      options: IOperationFuncOptions = {}
    ) {
      return loadBlockCollaboratorsOperationFunc(props, options);
    },

    async loadCollaborationRequests(
      props: ILoadBlockCollaborationRequestsOperationFuncDataProps,
      options: IOperationFuncOptions = {}
    ) {
      return loadBlockCollaborationRequestsOperationFunc(props, options);
    },

    async loadRootData() {
      return loadRootBlocksOperationFunc();
    }
  };
}
