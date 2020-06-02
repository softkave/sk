import { BlockType, IBlock } from "../../../models/block/block";
import {
  blockFragment,
  collaboratorFragment,
  errorFragment,
  notificationFragment,
} from "../../../models/fragments";
import { INetError } from "../../../net/types";
import { netCall } from "../../../net/utils";
import * as blockActions from "../../../redux/blocks/actions";
import * as notificationActions from "../../../redux/notifications/actions";
import { pushOperation } from "../../../redux/operations/actions";
import {
  isOperationStarted,
  operationStatusTypes,
} from "../../../redux/operations/operation";
import { getOperationWithIdForResource } from "../../../redux/operations/selectors";
import store from "../../../redux/store";
import * as userActions from "../../../redux/users/actions";
import useOperation, { IUseOperationStatus } from "../../hooks/useOperation";

const query = `
${errorFragment}
${collaboratorFragment}
${blockFragment}
${notificationFragment}
query LoadBoardDataQuery ($customId: String!) {
  block {
    getBlockCollaborators (customId: $customId) {
      errors {
        ...errorFragment
      }
      collaborators {
        ...collaboratorFragment
      }
    }
    getBlockNotifications (customId: $customId) {
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
  return netCall({
    query,
    paths,
    variables: { customId: block.customId },
  });
}

export default async function lo(block: IBlock) {
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
        status: operationStatusTypes.operationStarted,
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

    const collaborators = result.data[collaboratorsPath];
    const notifications = result.data[notificationsPath];

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
          status: operationStatusTypes.operationComplete,
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
          status: operationStatusTypes.operationError,
          timestamp: Date.now(),
        },
        block.customId
      )
    );
  }
}

export interface ILResult {
  loading: boolean;
  errors?: INetError[];
}

export function useBoardData(block: IBlock): ILResult {
  const loadStatus = useOperation(
    {
      operationId: opId,
      resourceId: block.customId,
    },
    (loadProps: IUseOperationStatus) => {
      if (block.type === BlockType.Org && !loadProps.operation) {
        lo(block);
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
