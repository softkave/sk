import { createAsyncThunk } from "@reduxjs/toolkit";
import { IBlock } from "../../../models/block/block";
import {
  collaboratorFragment,
  errorFragment,
  notificationFragment,
} from "../../../models/fragments";
import { netCallWithAuth } from "../../../net/utils";
import { newId } from "../../../utils/utils";
import BlockActions from "../../blocks/actions";
import NotificationActions from "../../notifications/actions";
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

const query = `
${errorFragment}
${collaboratorFragment}
${notificationFragment}
query LoadBoardDataQuery ($blockId: String!) {
  block {
    getBlockCollaborators (blockId: $blockId) {
      errors {
        ...errorFragment
      }
      collaborators {
        ...collaboratorFragment
      }
    }
    getBlockNotifications (blockId: $blockId) {
      errors {
        ...errorFragment
      }
      notifications {
        ...notificationFragment
      }
    }
  }
}
`;

const collaboratorsPath = "block.getBlockCollaborators";
const notificationsPath = "block.getBlockNotifications";
const paths = [collaboratorsPath, notificationsPath];

async function getData(block: IBlock) {
  return netCallWithAuth({
    query,
    paths,
    variables: { blockId: block.customId },
  });
}

export interface ILoadBoardDataOperationActionArgs {
  block: IBlock;
}

export const loadBoardDataOperationAction = createAsyncThunk<
  IOperation | undefined,
  GetOperationActionArgs<ILoadBoardDataOperationActionArgs>,
  IAppAsyncThunkConfig
>("blockOperation/loadBoardData", async (arg, thunkAPI) => {
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
      OperationType.LoadBoardData,
      arg.block.customId
    )
  );

  try {
    const result = await getData(arg.block);

    if (result.errors) {
      throw result.errors;
    }

    // TODO: find a better way to do this
    const collaborators = result.data[collaboratorsPath].collaborators;
    const notifications = result.data[notificationsPath].notifications;

    const collaboratorIds = collaborators.map(
      (collaborator) => collaborator.customId
    );
    const notificationIds = notifications.map(
      (notification) => notification.customId
    );
    await thunkAPI.dispatch(UserActions.bulkAddUsers(collaborators));
    await thunkAPI.dispatch(
      NotificationActions.bulkAddNotifications(notifications)
    );
    await thunkAPI.dispatch(
      BlockActions.updateBlock({
        id: arg.block.customId,
        data: {
          collaborators: collaboratorIds,
          notifications: notificationIds,
        },
        meta: { arrayUpdateStrategy: "replace" },
      })
    );

    await thunkAPI.dispatch(
      dispatchOperationCompleted(
        id,
        OperationType.LoadBoardData,
        arg.block.customId
      )
    );
  } catch (error) {
    await thunkAPI.dispatch(
      dispatchOperationError(
        id,
        OperationType.LoadBoardData,
        error,
        arg.block.customId
      )
    );
  }

  return OperationSelectors.getOperationWithId(thunkAPI.getState(), id);
});
