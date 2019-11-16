import { Dispatch } from "redux";
import { IBlock } from "../../../models/block/block";
import { IUser } from "../../../models/user/user";
import * as blockNet from "../../../net/block";
import OperationError from "../../../utils/operation-error/OperationError";
import * as blockActions from "../../blocks/actions";
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
import { addBlockOperationID } from "../operationIDs";
import { getOperationWithIDForResource } from "../selectors";
import { addTaskToUserIfAssigned } from "./getTasksAssignedToUser";

export interface IAddBlockOperationFuncDataProps {
  user: IUser;
  block: IBlock;
  parent?: IBlock;
}

export default async function addBlockOperationFunc(
  state: IReduxState,
  dispatch: Dispatch,
  dataProps: IAddBlockOperationFuncDataProps,
  options: IOperationFuncOptions = {}
) {
  const { user, block, parent } = dataProps;
  const operation = getOperationWithIDForResource(
    state,
    addBlockOperationID,
    block.customId
  );

  if (operation && isOperationStarted(operation, options.scopeID)) {
    return;
  }

  const newBlock = block;
  const dispatchOptions: IDispatchOperationFuncProps = {
    ...options,
    dispatch,
    operationID: addBlockOperationID,
    resourceID: newBlock.customId
  };

  dispatchOperationStarted(dispatchOptions);

  try {
    const result = await blockNet.addBlock({ block: newBlock });

    if (result && result.errors) {
      throw result.errors;
    }

    dispatch(blockActions.addBlockRedux(newBlock));

    if (parent) {
      const pluralType = `${newBlock.type}s`;
      const parentUpdate = { [pluralType]: [newBlock.customId] };

      if (newBlock.type === "group") {
        parentUpdate.groupTaskContext = [newBlock.customId!];
        parentUpdate.groupProjectContext = [newBlock.customId!];
      }

      dispatch(
        blockActions.updateBlockRedux(parent.customId, parentUpdate, {
          arrayUpdateStrategy: "concat"
        })
      );
    }

    if (newBlock.type === "org") {
      dispatch(
        userActions.updateUserRedux(
          user.customId,
          { orgs: [newBlock.customId] },
          { arrayUpdateStrategy: "concat" }
        )
      );
    }

    addTaskToUserIfAssigned(state, dispatch, block);
    dispatchOperationComplete(dispatchOptions);
  } catch (error) {
    const transformedError = OperationError.fromAny(error).transform({
      stripBaseNames: ["block"]
    });

    dispatchOperationError({ ...dispatchOptions, error: transformedError });
  }
}
