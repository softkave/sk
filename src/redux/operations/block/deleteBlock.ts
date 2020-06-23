import { createAsyncThunk } from "@reduxjs/toolkit";
import { BlockType, IBlock } from "../../../models/block/block";
import BlockAPI from "../../../net/block";
import { newId } from "../../../utils/utils";
import BlockActions from "../../blocks/actions";
import BlockSelectors from "../../blocks/selectors";
import SessionSelectors from "../../session/selectors";
import store from "../../store";
import { IAppAsyncThunkConfig } from "../../types";
import UserActions from "../../users/actions";
import {
  dispatchOperationCompleted,
  dispatchOperationError,
  dispatchOperationStarted,
  IOperation,
  isOperationStarted,
} from "../operation";
import OperationType from "../OperationType";
import OperationSelectors from "../selectors";
import { GetOperationActionArgs } from "../types";

export interface IDeleteBlockOperationActionArgs {
  block: IBlock;
}

export const deleteBlockOperationAction = createAsyncThunk<
  IOperation | undefined,
  GetOperationActionArgs<IDeleteBlockOperationActionArgs>,
  IAppAsyncThunkConfig
>("block/deleteBlock", async (arg, thunkAPI) => {
  const id = arg.opId || newId();

  const operation = OperationSelectors.getOperationWithId(
    thunkAPI.getState(),
    id
  );

  if (isOperationStarted(operation)) {
    return;
  }

  await thunkAPI.dispatch(
    dispatchOperationStarted(id, OperationType.DeleteBlock, arg.block.customId)
  );

  try {
    const result = await BlockAPI.deleteBlock(arg.block);

    if (result && result.errors) {
      throw result.errors;
    }

    // TODO: find a more efficient way to do this
    const blockChildren = BlockSelectors.getBlockChildren(
      thunkAPI.getState(),
      arg.block
    );

    if (blockChildren.length > 0) {
      await thunkAPI.dispatch(
        BlockActions.bulkDeleteBlocks(
          blockChildren.map((child) => child.customId)
        )
      );
    }

    const parentId = arg.block.parent;

    if (parentId && arg.block.type === BlockType.Board) {
      const parent = BlockSelectors.getBlock(thunkAPI.getState(), parentId);

      if (parent) {
        const pluralType = `${arg.block.type}s`;
        const container = parent[pluralType] || [];
        const parentUpdate = {
          [pluralType]: container.filter((id) => id !== arg.block.customId),
        };

        await thunkAPI.dispatch(
          BlockActions.updateBlock({
            id: parent.customId,
            data: parentUpdate,
            meta: {
              arrayUpdateStrategy: "replace",
            },
          })
        );
      }
    }

    const user = SessionSelectors.getSignedInUserRequired(thunkAPI.getState());

    if (arg.block.type === "org") {
      const orgIndex = user.orgs.findIndex(
        (org) => org.customId === arg.block.customId
      );
      const orgs = [...user.orgs];
      orgs.splice(orgIndex, 1);

      await thunkAPI.dispatch(
        UserActions.updateUser({
          id: user.customId,
          data: { orgs },
          meta: { arrayUpdateStrategy: "replace" },
        })
      );
    }

    await thunkAPI.dispatch(BlockActions.deleteBlock(arg.block.customId));

    await thunkAPI.dispatch(
      dispatchOperationCompleted(
        id,
        OperationType.DeleteBlock,
        arg.block.customId
      )
    );
  } catch (error) {
    await thunkAPI.dispatch(
      dispatchOperationError(
        id,
        OperationType.DeleteBlock,
        error,
        arg.block.customId
      )
    );
  }

  return OperationSelectors.getOperationWithId(thunkAPI.getState(), id);
});
