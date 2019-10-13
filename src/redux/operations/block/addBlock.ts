import moment from "moment";
import randomColor from "randomcolor";
import { Dispatch } from "redux";
import { IBlock } from "../../../models/block/block";
import { getBlockValidChildrenTypes } from "../../../models/block/utils";
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
  isOperationStarted
} from "../operation";
import { addBlockOperationID } from "../operationIDs";
import { getOperationWithIDForResource } from "../selectors";

export default async function addBlockOperation(
  state: IReduxState,
  dispatch: Dispatch,
  user: IUser,
  block: IBlock,
  parent?: IBlock
) {
  const operation = getOperationWithIDForResource(
    state,
    addBlockOperationID,
    block.customId
  );

  if (operation && isOperationStarted(operation)) {
    return;
  }

  const newBlock = { ...block } as IBlock;

  // TODO: Move creation of ids ( any resource at all ) to the server
  // Maybe get the id from the server when a form is created without an initial data, or without data with id
  // newBlock.customId = newId();

  dispatchOperationStarted(dispatch, addBlockOperationID, newBlock.customId);

  newBlock.createdAt = Date.now();
  newBlock.createdBy = user.customId;
  newBlock.color = randomColor();

  if (newBlock.expectedEndAt && typeof newBlock.expectedEndAt !== "number") {
    newBlock.expectedEndAt = moment(newBlock.expectedEndAt).valueOf();
  }

  newBlock.groupTaskContext = [];
  newBlock.groupProjectContext = [];

  const childrenTypes = getBlockValidChildrenTypes(newBlock);

  if (parent) {
    const ancestors = Array.isArray(parent.parents) ? parent.parents : [];
    newBlock.parents = [...ancestors, parent.customId];
  }

  if (newBlock.type === "org") {
    newBlock.collaborators = [user.customId];
  } else if (newBlock.type === "task") {
    if (!newBlock.taskCollaborators) {
      newBlock.taskCollaborators = [];
    }
  }

  if (childrenTypes.length > 0) {
    childrenTypes.forEach(type => {
      const pluralType = `${type}s`;
      newBlock[pluralType] = [];
    });
  }

  try {
    const result = await blockNet.addBlock({ block: newBlock });

    if (result && result.errors) {
      throw result.errors;
    }

    dispatch(blockActions.addBlockRedux(newBlock as IBlock));

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

    dispatchOperationComplete(dispatch, addBlockOperationID, newBlock.customId);
  } catch (error) {
    const transformedError = OperationError.fromAny(error).transform({
      stripBaseNames: ["block"]
    });

    dispatchOperationError(
      dispatch,
      addBlockOperationID,
      newBlock.customId,
      transformedError
    );
  }
}
