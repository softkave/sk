import { IBlock } from "../../../models/block/block";
import {
  blockFragment,
  collaboratorFragment,
  errorFragment,
  notificationFragment,
} from "../../../models/fragments";
import { INetError } from "../../../net/types";
import { netCall } from "../../../net/utils";
import { IOperationFuncOptions } from "../../../redux/operations/operation";
import { getOperationWithIdForResource } from "../../../redux/operations/selectors";

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
const paths = ["block.getBlockCollaborators", "block.getBlockNotifications"];

async function getData(block: IBlock) {
  return netCall({
    query,
    paths,
    variables: { customId: block.customId },
  });
}

export default async function lo(
  block: IBlock,
  options: IOperationFuncOptions = {}
) {
  const operation = getOperationWithIdForResource(
    store.getState(),
    opId,
    block.customId
  );

  if (operation && isOperationStarted(operation, options.scopeId)) {
    return;
  }

  store.dispatch(
    pushOperation(
      opId,
      {
        scopeID: options.scopeId,
        status: operationStatusTypes.operationStarted,
        timestamp: Date.now(),
      },
      block.customId
    )
  );

  try {
    const result = await getData(block);

    if (result && result.errors) {
      throw result.errors;
    }

    const { collaborators } = result;
    const ids = collaborators.map((collaborator) => collaborator.customId);
    store.dispatch(userActions.bulkAddUsersRedux(collaborators));
    store.dispatch(
      blockActions.updateBlockRedux(
        block.customId,
        {
          collaborators: ids,
        },
        { arrayUpdateStrategy: "replace" }
      )
    );

    store.dispatch(
      pushOperation(
        opId,
        {
          scopeID: options.scopeId,
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
          scopeID: options.scopeId,
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

export function l(block: IBlock): ILResult {
  const loadBlockChildren = (loadProps: IUseOperationStatus) => {
    if (!loadProps.operation) {
      loadBlockChildrenOperationFunc({ block, updateParentInStore: true });
    }
  };

  const loadChildrenStatus = useOperation(
    {
      operationID: getBlockChildrenOperationID,
      resourceID: block.customId,
    },
    loadBlockChildren
  );

  const hasCollaborators = block.type === "org";
  const loadCollaboratorsStatus = useOperation(
    {
      operationID: getBlockCollaboratorsOperationID,
      resourceID: block.customId,
    },
    hasCollaborators && loadOrgCollaborators
  );

  const isLoadingCollaborators =
    hasCollaborators &&
    (loadCollaboratorsStatus.isLoading || !!!loadCollaboratorsStatus.operation);

  const hasRequests = block.type === "org";
  const loadRequestsStatus = useOperation(
    {
      operationID: getBlockCollaborationRequestsOperationID,
      resourceID: block.customId,
    },
    hasRequests && loadOrgCollaborationRequests
  );

  const isLoadingRequests =
    hasRequests &&
    (loadRequestsStatus.isLoading || !!!loadRequestsStatus.operation);

  const loadBlockChildren = (loadProps: IUseOperationStatus) => {
    if (!!!loadProps.operation) {
      loadBlockChildrenOperationFunc({ block, updateParentInStore: true });
    }
  };
}
