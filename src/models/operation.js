import { newId } from "../utils/utils";
import { setDataByPath, mergeDataByPath } from "../redux/actions/data";
import { makeMultiple } from "../redux/actions/make";
import store from "../redux/store";

export const operationStatus = {
  pending: "pending",
  completed: "completed",
  failed: "failed"
};

const operationsLifecycles = {};

async function finishOperationLifecycle() {
  const state = store.getState();
  const operations = state.operations;

  if (Array.isArray(operations) && operations.length > 0) {
    const currentOperation = operations[0];

    if (currentOperation.status !== "pending") {
      const lifecycleMethods = operationsLifecycles[currentOperation.customId];

      if (
        lifecycleMethods &&
        typeof lifecycleMethods.postPerform === "function"
      ) {
        await lifecycleMethods.postPerform(currentOperation);
      }
    }
  }
}

store.subscribe(finishOperationLifecycle);

export function aop(dispatch, data, netPath, lifecycle, ...args) {
  if (!Array.isArray(data.operations)) {
    data.operations = {};
  }

  const operationId = newId();
  const operationsPath = `${data.path}.operations`;
  const reduxPath = `${operationsPath}.${operationId}`;
  data.operations[operationId] = {
    customId: operationId,
    args,
    netPath,
    reduxPath,
    status: "pending",
    result: null
  };

  const actions = [];
  actions.push(setDataByPath(operationsPath, data.operations));
  actions.push(mergeDataByPath(reduxPath));
  dispatch(makeMultiple(actions));
}

export function addOperation(
  dispatch,
  data,
  netPath,
  deleteOperation,
  ...args
) {
  if (!Array.isArray(data.operations)) {
    data.operations = {};
  }

  const operationId = newId();
  const operationsPath = `${data.path}.operations`;
  const reduxPath = `${operationsPath}.${operationId}`;
  data.operations[operationId] = {
    args,
    netPath,
    reduxPath,
    deleteOperation,
    status: "pending",
    result: null,
    resourcePath: data.path
  };

  const actions = [];
  actions.push(setDataByPath(operationsPath, data.operations));
  actions.push(mergeDataByPath(reduxPath));
  dispatch(makeMultiple(actions));
}
