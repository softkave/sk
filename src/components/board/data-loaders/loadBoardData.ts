import React from "react";
import { BlockType, IBlock } from "../../../models/block/block";
import {
  collaboratorFragment,
  errorFragment,
  notificationFragment,
} from "../../../models/fragments";
import { INetError } from "../../../net/types";
import { netCallWithAuth } from "../../../net/utils";
import * as blockActions from "../../../redux/blocks/actions";
import * as notificationActions from "../../../redux/notifications/actions";
import OperationActions from "../../../redux/operations/actions";
import {
  isOperationStarted,
  OperationStatus,
} from "../../../redux/operations/operation";
import OperationType from "../../../redux/operations/OperationType";
import OperationSelectors from "../../../redux/operations/selectors";
import store from "../../../redux/store";
import * as userActions from "../../../redux/users/actions";
import { newId } from "../../../utils/utils";
import useOperation, { IUseOperationStatus } from "../../hooks/useOperation";

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

export default async function loadBoardData(block: IBlock, id: string) {
  const operation = OperationSelectors.getOperationWithId(store.getState(), id);

  if (operation && isOperationStarted(operation)) {
    return;
  }

  store.dispatch(
    OperationActions.pushOperation({
      id,
      operationType: OperationType.LoadBoardData,
      status: {
        status: OperationStatus.Started,
        timestamp: Date.now(),
      },
      resourceId: block.customId,
    })
  );

  try {
    const result = await getData(block);

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
    store.dispatch(userActions.bulkAddUsersRedux(collaborators));
    store.dispatch(
      notificationActions.bulkAddNotificationsRedux(notifications)
    );
    store.dispatch(
      blockActions.updateBlockRedux(
        block.customId,
        {
          collaborators: collaboratorIds,
          notifications: notificationIds,
        },
        { arrayUpdateStrategy: "replace" }
      )
    );

    store.dispatch(
      OperationActions.pushOperation({
        id,
        operationType: OperationType.LoadBoardData,
        status: {
          status: OperationStatus.Completed,
          timestamp: Date.now(),
        },
        resourceId: block.customId,
      })
    );
  } catch (error) {
    store.dispatch(
      OperationActions.pushOperation({
        id,
        operationType: OperationType.LoadBoardData,
        status: {
          error,
          status: OperationStatus.Error,
          timestamp: Date.now(),
        },
        resourceId: block.customId,
      })
    );
  }
}

export interface IUseBoardDataResult {
  loading: boolean;
  errors?: INetError[];
}

export function useBoardData(block: IBlock): IUseBoardDataResult {
  const loadStatus = useOperation(
    { id: block.customId },
    (loadProps: IUseOperationStatus) => {
      if (block.type === BlockType.Org && !loadProps.operation) {
        loadBoardData(block, loadProps.id);
      }
    }
  );

  return {
    loading:
      block.type === BlockType.Org
        ? loadStatus.isLoading || !loadStatus.operation
        : false,
    errors: loadStatus.error,
  };
}
