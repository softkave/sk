import { Dispatch } from "redux";

import { IBlock } from "../../../models/block/block";
import * as blockNet from "../../../net/block";
import * as blockActions from "../../blocks/actions";
import { IReduxState } from "../../store";
import * as userActions from "../../users/actions";
import { transformError } from "../error";
import {
  dispatchOperationComplete,
  dispatchOperationError,
  dispatchOperationStarted,
  isOperationStarted
} from "../operation";
import { getBlockCollaboratorsOperationID } from "../operationIDs";
import { getOperationWithIDForResource } from "../selectors";

export default async function loadBlockCollaboratorsOperation(
  state: IReduxState,
  dispatch: Dispatch,
  block: IBlock
) {
  const operation = getOperationWithIDForResource(
    state,
    getBlockCollaboratorsOperationID,
    block.customId
  );

  if (operation && isOperationStarted(operation)) {
    return;
  }

  dispatchOperationStarted(
    dispatch,
    getBlockCollaboratorsOperationID,
    block.customId
  );

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

    dispatchOperationComplete(
      dispatch,
      getBlockCollaboratorsOperationID,
      block.customId
    );
  } catch (error) {
    const transformedError = transformError(error);
    dispatchOperationError(
      dispatch,
      getBlockCollaboratorsOperationID,
      block.customId,
      transformedError
    );
  }
}
