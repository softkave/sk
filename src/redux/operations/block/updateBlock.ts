import moment from "moment";
import { Dispatch } from "redux";
import { addCustomIDToSubTasks } from "../../../components/block/getNewBlock";
import { IBlock } from "../../../models/block/block";
import { getBlockParentIDs } from "../../../models/block/utils";
import * as blockNet from "../../../net/block";
import OperationError from "../../../utils/operation-error/OperationError";
import * as blockActions from "../../blocks/actions";
import { getBlock } from "../../blocks/selectors";
import { IReduxState } from "../../store";
import {
  dispatchOperationComplete,
  dispatchOperationError,
  dispatchOperationStarted,
  IDispatchOperationFuncProps,
  IOperationFuncOptions,
  isOperationStarted
} from "../operation";
import { updateBlockOperationID } from "../operationIDs";
import { getOperationWithIDForResource } from "../selectors";
import { addTaskToUserIfAssigned } from "./getTasksAssignedToUser";
import {
  hasBlockParentsChanged,
  transferBlockStateHelper
} from "./transferBlock";

export interface IUpdateBlockOperationFuncDataProps {
  block: IBlock;
  data: Partial<IBlock>;
}

export default async function updateBlockOperationFunc(
  state: IReduxState,
  dispatch: Dispatch,
  dataProps: IUpdateBlockOperationFuncDataProps,
  options: IOperationFuncOptions = {}
) {
  const { block, data } = dataProps;
  const operation = getOperationWithIDForResource(
    state,
    updateBlockOperationID,
    block.customId
  );

  if (operation && isOperationStarted(operation, options.scopeID)) {
    return;
  }

  if (data.expectedEndAt && typeof data.expectedEndAt !== "number") {
    data.expectedEndAt = moment(data.expectedEndAt).valueOf();
  } else if (data.type === "task") {
    data.subTasks = addCustomIDToSubTasks(data.subTasks);
  }

  const dispatchOptions: IDispatchOperationFuncProps = {
    ...options,
    dispatch,
    operationID: updateBlockOperationID,
    resourceID: block.customId
  };

  dispatchOperationStarted(dispatchOptions);

  try {
    if (block.type === "task") {
      if (data.taskCollaborationType!.collaborationType === null) {
        data.taskCollaborationType!.collaborationType = "collective";
      }

      // if (
      //   block.taskCollaborationType!.collaborationType !==
      //   data.taskCollaborationType!.collaborationType
      // ) {
      //   // strip previous task collaboration type data
      //   data.taskCollaborationType = {
      //     collaborationType: data.taskCollaborationType!.collaborationType,
      //     completedAt: null,
      //     completedBy: null
      //   };

      //   if (data.taskCollaborationType.collaborationType === "collective") {
      //     // remove completed information in exisiting task collaborators data
      //     data.taskCollaborators = data.taskCollaborators!.map(
      //       taskCollaborator => ({
      //         ...taskCollaborator,
      //         completedAt: 0
      //       })
      //     );
      //   }
      // }
    }

    const result = await blockNet.updateBlock({ block, data });

    if (result && result.errors) {
      throw result.errors;
    }

    addTaskToUserIfAssigned(state, dispatch, block);
    const forTransferBlockOnly = { ...block, ...data };

    if (hasBlockParentsChanged(block, forTransferBlockOnly)) {
      const blockParentIDs = getBlockParentIDs(block);
      const transferBlockParentIDs = getBlockParentIDs(forTransferBlockOnly);
      transferBlockStateHelper(state, dispatch, {
        draggedBlock: forTransferBlockOnly,
        sourceBlock: getBlock(state, blockParentIDs[blockParentIDs.length - 1]),
        destinationBlock: getBlock(
          state,
          transferBlockParentIDs[transferBlockParentIDs.length - 1]
        )
      });
    }

    dispatch(
      blockActions.updateBlockRedux(block.customId, data, {
        arrayUpdateStrategy: "replace"
      })
    );

    dispatchOperationComplete(dispatchOptions);
  } catch (error) {
    const transformedError = OperationError.fromAny(error).transform({
      stripBaseNames: ["data"]
    });

    dispatchOperationError({ ...dispatchOptions, error: transformedError });
  }
}
