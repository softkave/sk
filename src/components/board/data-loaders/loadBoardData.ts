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
import { pushOperation } from "../../../redux/operations/actions";
import {
  isOperationStarted,
  OperationStatus,
} from "../../../redux/operations/operation";
import { getOperationWithIdForResource } from "../../../redux/operations/selectors";
import store from "../../../redux/store";
import * as userActions from "../../../redux/users/actions";
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

const opId = "load-board-data";
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

export default async function loadBoardData(block: IBlock) {
  const operation = getOperationWithIdForResource(
    store.getState(),
    opId,
    block.customId
  );

  if (operation && isOperationStarted(operation)) {
    return;
  }

  store.dispatch(
    pushOperation(
      opId,
      {
        status: OperationStatus.Started,
        timestamp: Date.now(),
      },
      block.customId
    )
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
      pushOperation(
        opId,
        {
          status: OperationStatus.Completed,
          timestamp: Date.now(),
        },
        block.customId
      )
    );
  } catch (error) {
    store.dispatch(
      pushOperation(
        opId,
        {
          error,
          status: OperationStatus.Error,
          timestamp: Date.now(),
        },
        block.customId
      )
    );
  }
}

export interface IUseBoardDataResult {
  loading: boolean;
  errors?: INetError[];
}

export function useBoardData(block: IBlock): IUseBoardDataResult {
  const loadStatus = useOperation(
    {
      operationId: opId,
      resourceId: block.customId,
    },
    (loadProps: IUseOperationStatus) => {
      if (block.type === BlockType.Org && !loadProps.operation) {
        loadBoardData(block);
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
