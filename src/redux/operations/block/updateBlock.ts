import moment from "moment";
import { Dispatch } from "redux";
import { IBlock } from "../../../models/block/block";
import { getUserTaskCollaborator } from "../../../models/block/utils";
import * as blockNet from "../../../net/block";
import OperationError from "../../../utils/operation-error/OperationError";
import * as blockActions from "../../blocks/actions";
import { getSignedInUserRequired } from "../../session/selectors";
import { IReduxState } from "../../store";
import * as userActions from "../../users/actions";
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
  }

  const dispatchOptions: IDispatchOperationFuncProps = {
    ...options,
    dispatch,
    operationID: updateBlockOperationID,
    resourceID: block.customId
  };

  dispatchOperationStarted(dispatchOptions);

  try {
    const result = await blockNet.updateBlock({ block, data });

    if (result && result.errors) {
      throw result.errors;
    }

    if (block.type === "task") {
      const user = getSignedInUserRequired(state);

      if (Array.isArray(user.assignedTasks)) {
        const assignedTaskIDs = [...user.assignedTasks];
        const isAssignedToUser = !!getUserTaskCollaborator(block, user);
        const taskIDIndex = assignedTaskIDs.indexOf(block.customId);

        if (isAssignedToUser) {
          if (taskIDIndex === -1) {
            assignedTaskIDs.push(block.customId);
          }
        } else {
          if (taskIDIndex !== -1) {
            assignedTaskIDs.splice(taskIDIndex, 1);
          }
        }

        dispatch(
          userActions.updateUserRedux(
            user.customId,
            {
              assignedTasks: assignedTaskIDs
            },
            { arrayUpdateStrategy: "replace" }
          )
        );
      }
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
