import IOperation, {
  isOperationCompleted,
  isOperationError,
  isOperationPending,
  isOperationStarted
} from "../../redux/operations/operation";

export default function getViewFromOperations(
  operations: Array<IOperation | undefined>,
  defaultView = { viewName: "loading" }
) {
  if (
    operations.findIndex(operation => {
      return typeof operation !== "object" && !Array.isArray(operation);
    }) !== -1
  ) {
    return defaultView;
  }

  if (
    operations.find(operation => {
      return isOperationStarted(operation!) || isOperationPending(operation!);
    })
  ) {
    return {
      viewName: "loading"
    };
  }

  if (
    operations.find(operation => {
      return isOperationError(operation!);
    })
  ) {
    return {
      viewName: "error"
    };
  }

  if (
    operations.find(operation => {
      return isOperationCompleted(operation!);
    })
  ) {
    return {
      viewName: "ready"
    };
  }

  // TODO: Track errors globally and report them
  throw new Error("Status check failed");
}
