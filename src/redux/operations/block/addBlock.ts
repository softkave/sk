import { addCustomIdToSubTasks } from "../../../components/block/getNewBlock";
import { IBlock } from "../../../models/block/block";
import { IUser } from "../../../models/user/user";
import * as blockNet from "../../../net/block";
import * as blockActions from "../../blocks/actions";
import { getBlock } from "../../blocks/selectors";
import store from "../../store";
import * as userActions from "../../users/actions";
import { pushOperation } from "../actions";
import {
  IOperationFuncOptions,
  isOperationStarted,
  OperationStatus,
} from "../operation";
import { OperationIds.addBlock } from "../opc";
import { getOperationWithIdForResource } from "../selectors";

export interface IAddBlockOperationFuncDataProps {
  user: IUser;
  block: IBlock;
}

export default async function addBlockOperationFunc(
  dataProps: IAddBlockOperationFuncDataProps,
  options: IOperationFuncOptions = {}
) {
  const { user, block } = dataProps;
  const operation = getOperationWithIdForResource(
    store.getState(),
    OperationIds.addBlock,
    block.customId
  );

  if (operation && isOperationStarted(operation, options.scopeId)) {
    return;
  }

  const newBlock = block;

  store.dispatch(
    pushOperation(
      OperationIds.addBlock,
      {
        scopeId: options.scopeId,
        status: OperationStatus.Started,
        timestamp: Date.now(),
      },
      block.customId
    )
  );

  try {
    if (newBlock.type === "task") {
      newBlock.subTasks = addCustomIdToSubTasks(newBlock.subTasks);
    }

    const result = await blockNet.addBlock(newBlock);

    if (result && result.errors) {
      throw result.errors;
    }

    store.dispatch(blockActions.addBlockRedux(newBlock));

    let parent: IBlock | undefined;

    if (newBlock.parent) {
      parent = getBlock(store.getState(), newBlock.parent);

      if (!parent) {
        throw new Error("Internal error -- Parent not present in store");
      }
    }

    if (parent) {
      const pluralType = `${newBlock.type}s`;
      const parentUpdate = { [pluralType]: [newBlock.customId] };

      store.dispatch(
        blockActions.updateBlockRedux(parent.customId, parentUpdate, {
          arrayUpdateStrategy: "concat",
        })
      );
    }

    if (newBlock.type === "org") {
      store.dispatch(
        userActions.updateUserRedux(
          user.customId,
          { orgs: [{ customId: newBlock.customId }] },
          { arrayUpdateStrategy: "concat" }
        )
      );
    }

    store.dispatch(
      pushOperation(
        OperationIds.addBlock,
        {
          scopeId: options.scopeId,
          status: OperationStatus.Completed,
          timestamp: Date.now(),
        },
        block.customId
      )
    );
  } catch (error) {
    store.dispatch(
      pushOperation(
        OperationIds.addBlock,
        {
          error,
          scopeId: options.scopeId,
          status: OperationStatus.Error,
          timestamp: Date.now(),
        },
        block.customId
      )
    );
  }
}
