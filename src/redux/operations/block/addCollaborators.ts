import { createAsyncThunk } from "@reduxjs/toolkit";
import moment from "moment";
import { IBlock } from "../../../models/block/block";
import { IAddCollaboratorFormItemValues } from "../../../models/types";
import BlockAPI from "../../../net/block";
import { newId } from "../../../utils/utils";
import { IAppAsyncThunkConfig } from "../../types";
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

export interface IAddCollaboratorsOperationActionArgs {
  block: IBlock;

  // TODO: better declare type, don't rely on form values
  collaborators: IAddCollaboratorFormItemValues[];
  message?: string;
  expiresAt?: number | Date;
}

export const addCollaboratorsOperationAction = createAsyncThunk<
  IOperation | undefined,
  GetOperationActionArgs<IAddCollaboratorsOperationActionArgs>,
  IAppAsyncThunkConfig
>("block/addCollaborators", async (arg, thunkAPI) => {
  const id = arg.opId || newId();

  const operation = OperationSelectors.getOperationWithId(
    thunkAPI.getState(),
    id
  );

  if (isOperationStarted(operation)) {
    return;
  }

  await thunkAPI.dispatch(
    dispatchOperationStarted(
      id,
      OperationType.AddCollaborators,
      arg.block.customId
    )
  );

  try {
    const proccessedCollaborators = arg.collaborators.map((request) => {
      const requestExpiresAt = request.expiresAt || arg.expiresAt;

      return {
        ...request,
        body: request.body || arg.message!,
        expiresAt: requestExpiresAt
          ? moment(requestExpiresAt).valueOf()
          : undefined,
        customId: newId(),
      };
    });

    const result = await BlockAPI.addCollaborators(
      arg.block,
      proccessedCollaborators
    );

    if (result && result.errors) {
      throw result.errors;
    }

    await thunkAPI.dispatch(
      dispatchOperationCompleted(
        id,
        OperationType.AddCollaborators,
        arg.block.customId
      )
    );
  } catch (error) {
    await thunkAPI.dispatch(
      dispatchOperationError(
        id,
        OperationType.AddCollaborators,
        error,
        arg.block.customId
      )
    );
  }

  return OperationSelectors.getOperationWithId(thunkAPI.getState(), id);
});
