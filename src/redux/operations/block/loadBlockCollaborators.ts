import { Dispatch } from "redux";
import { IBlock } from "../../../models/block/block";
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
import { getBlockCollaboratorsOperationID } from "../operationIDs";
import { getOperationWithIDForResource } from "../selectors";

export interface ILoadBlockCollaboratorsOperationFuncDataProps {
  block: IBlock;
}

export default async function loadBlockCollaboratorsOperationFunc(
  state: IReduxState,
  dispatch: Dispatch,
  dataProps: ILoadBlockCollaboratorsOperationFuncDataProps,
  options: IOperationFuncOptions = {}
) {
  const { block } = dataProps;
  const operation = getOperationWithIDForResource(
    state,
    getBlockCollaboratorsOperationID,
    block.customId
  );

  if (operation && isOperationStarted(operation, options.scopeID)) {
    return;
  }

  const dispatchOptions: IDispatchOperationFuncProps = {
    ...options,
    dispatch,
    operationID: getBlockCollaboratorsOperationID,
    resourceID: block.customId
  };

  dispatchOperationStarted(dispatchOptions);

  try {
    const result = await blockNet.getCollaborators({ block });

    if (result && result.errors) {
      throw result.errors;
    }

    const { collaborators } = result;
    const ids = collaborators.map(collaborator => collaborator.customId);
    dispatch(userActions.bulkAddUsersRedux(collaborators));
    dispatch(
      blockActions.updateBlockRedux(
        block.customId,
        {
          collaborators: ids
        },
        { arrayUpdateStrategy: "replace" }
      )
    );

    dispatchOperationComplete(dispatchOptions);
  } catch (error) {
    const transformedError = OperationError.fromAny(error);

    dispatchOperationError({ ...dispatchOptions, error: transformedError });
  }
}
