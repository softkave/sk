import { addCustomIDToSubTasks } from "../../../components/block/getNewBlock";
import { IBlock } from "../../../models/block/block";
import { IUser } from "../../../models/user/user";
import * as blockNet from "../../../net/block";
import OperationError from "../../../utils/operation-error/OperationError";
import * as blockActions from "../../blocks/actions";
import store from "../../store";
import * as userActions from "../../users/actions";
import { pushOperation } from "../actions";
import {
  defaultOperationStatusTypes,
  IOperationFuncOptions,
  isOperationStarted
} from "../operation";
import { addBlockOperationID } from "../operationIDs";
import { getOperationWithIDForResource } from "../selectors";
import { addTaskToUserIfAssigned } from "./getTasksAssignedToUser";

export interface IAddBlockOperationFuncDataProps {
  user: IUser;
  block: IBlock;
  parent?: IBlock;
}

export default async function addBlockOperationFunc(
  dataProps: IAddBlockOperationFuncDataProps,
  options: IOperationFuncOptions = {}
) {
  const { user, block, parent } = dataProps;
  const operation = getOperationWithIDForResource(
    store.getState(),
    addBlockOperationID,
    block.customId
  );

  if (operation && isOperationStarted(operation, options.scopeID)) {
    return;
  }

  const newBlock = block;

  store.dispatch(
    pushOperation(
      addBlockOperationID,
      {
        scopeID: options.scopeID,
        status: defaultOperationStatusTypes.operationStarted,
        timestamp: Date.now()
      },
      block.customId
    )
  );

  try {
    if (newBlock.type === "task") {
      newBlock.subTasks = addCustomIDToSubTasks(newBlock.subTasks);
    }

    const result = await blockNet.addBlock({ block: newBlock });

    if (result && result.errors) {
      throw result.errors;
    }

    store.dispatch(blockActions.addBlockRedux(newBlock));

    if (parent) {
      const pluralType = `${newBlock.type}s`;
      const parentUpdate = { [pluralType]: [newBlock.customId] };

      if (newBlock.type === "group") {
        parentUpdate.groupTaskContext = [newBlock.customId!];
        parentUpdate.groupProjectContext = [newBlock.customId!];
      }

      store.dispatch(
        blockActions.updateBlockRedux(parent.customId, parentUpdate, {
          arrayUpdateStrategy: "concat"
        })
      );
    }

    if (newBlock.type === "org") {
      store.dispatch(
        userActions.updateUserRedux(
          user.customId,
          { orgs: [newBlock.customId] },
          { arrayUpdateStrategy: "concat" }
        )
      );
    }

    addTaskToUserIfAssigned(block);

    store.dispatch(
      pushOperation(
        addBlockOperationID,
        {
          scopeID: options.scopeID,
          status: defaultOperationStatusTypes.operationComplete,
          timestamp: Date.now()
        },
        block.customId
      )
    );
  } catch (error) {
    const transformedError = OperationError.fromAny(error).transform({
      stripBaseNames: ["block"]
    });

    store.dispatch(
      pushOperation(
        addBlockOperationID,
        {
          error: transformedError,
          scopeID: options.scopeID,
          status: defaultOperationStatusTypes.operationError,
          timestamp: Date.now()
        },
        block.customId
      )
    );
  }
}
