import moment from "moment";
import randomColor from "randomcolor";
import { Dispatch } from "redux";

import { IBlock } from "../../../models/block/block";
import { getBlockValidChildrenTypes } from "../../../models/block/utils";
import { IUser } from "../../../models/user/user";
import * as blockNet from "../../../net/block";
import { newId } from "../../../utils/utils";
import * as blockActions from "../../blocks/actions";
import { IReduxState } from "../../store";
import * as userActions from "../../users/actions";
import { transformError } from "../error";
import {
  dispatchOperationComplete,
  dispatchOperationError,
  dispatchOperationStarted
} from "../operation";
import { addBlockOperationID } from "../operationIDs";

export default async function addBlockOperation(
  state: IReduxState,
  dispatch: Dispatch,
  user: IUser,
  block: Partial<IBlock>,
  parent?: IBlock
) {
  const newBlock = { ...block } as IBlock;
  newBlock.customId = newId();

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

    if (result.errors) {
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

    dispatchOperationComplete(dispatch, addBlockOperationID);
  } catch (error) {
    const transformedError = transformError(error, {
      stripBaseNames: ["block"]
    });

    dispatchOperationError(
      dispatch,
      addBlockOperationID,
      null,
      transformedError
    );
  }
}
