import { createAsyncThunk } from "@reduxjs/toolkit";
import { addCustomIdToSubTasks } from "../../../components/block/getNewBlock";
import { BlockType, IBlock } from "../../../models/block/block";
import BlockAPI from "../../../net/block";
import { newId } from "../../../utils/utils";
import BlockActions from "../../blocks/actions";
import BlockSelectors from "../../blocks/selectors";
import SessionSelectors from "../../session/selectors";
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

export interface IAddBlockOperationActionArgs {
  block: IBlock;
}

export const addBlockOperationAction = createAsyncThunk<
  IOperation | undefined,
  GetOperationActionArgs<IAddBlockOperationActionArgs>,
  IAppAsyncThunkConfig
>("blockOperation/addBlock", async (arg, thunkAPI) => {
  const id = arg.opId || newId();

  const operation = OperationSelectors.getOperationWithId(
    thunkAPI.getState(),
    id
  );

  if (isOperationStarted(operation)) {
    return;
  }

  await thunkAPI.dispatch(
    dispatchOperationStarted(id, OperationType.AddBlock, arg.block.customId)
  );

  try {
    const user = SessionSelectors.getSignedInUserRequired(thunkAPI.getState());

    if (arg.block.type === BlockType.Task) {
      arg.block.subTasks = addCustomIdToSubTasks(arg.block.subTasks);
    }

    const result = await BlockAPI.addBlock(arg.block);

    if (result && result.errors) {
      throw result.errors;
    }

    await thunkAPI.dispatch(BlockActions.addBlock(arg.block));

    let parent: IBlock | undefined;

    if (arg.block.parent) {
      parent = BlockSelectors.getBlock(thunkAPI.getState(), arg.block.parent);
    }

    if (parent && arg.block.type === BlockType.Board) {
      const pluralType = `${arg.block.type}s`;
      const parentUpdate = { [pluralType]: [arg.block.customId] };

      await thunkAPI.dispatch(
        BlockActions.updateBlock({
          id: parent.customId,
          data: parentUpdate,
          meta: {
            arrayUpdateStrategy: "concat",
          },
        })
      );
    }

    if (arg.block.type === BlockType.Org) {
      await thunkAPI.dispatch(
        UserActions.updateUser({
          id: user.customId,
          data: { orgs: [{ customId: arg.block.customId }] },
          meta: { arrayUpdateStrategy: "concat" },
        })
      );
    }

    await thunkAPI.dispatch(
      dispatchOperationCompleted(id, OperationType.AddBlock, arg.block.customId)
    );
  } catch (error) {
    await thunkAPI.dispatch(
      dispatchOperationError(
        id,
        OperationType.AddBlock,
        error,
        arg.block.customId
      )
    );
  }

  return OperationSelectors.getOperationWithId(thunkAPI.getState(), id);
});
