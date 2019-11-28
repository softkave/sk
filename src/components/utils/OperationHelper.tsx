import isFunction from "lodash/isFunction";
import React from "react";
import { useStore } from "react-redux";
import IOperation, {
  getOperationLastError,
  getOperationLastStatus,
  IOperationStatus,
  isOperationCompleted,
  isOperationStartedOrPending
} from "../../redux/operations/operation";
import { getFirstOperationWithID } from "../../redux/operations/selectors";
import { IReduxState } from "../../redux/store";
import GeneralError from "../GeneralError";
import Loading from "../Loading";

export interface IOperationHelperDerivedProps {
  isLoading?: boolean;
  isError?: boolean;
  isCompleted?: boolean;
  operation?: IOperation;
  currentStatus?: IOperationStatus;
}

export interface IOperationHelperProps {
  operationID: string;
  render: (props: IOperationHelperDerivedProps) => React.ReactElement;
  scopeID?: string;
  loadFunc?: (props: IOperationHelperDerivedProps) => void;
}

const OperationHelper: React.SFC<IOperationHelperProps> = props => {
  const { operationID, render, loadFunc, scopeID } = props;
  const store = useStore<IReduxState>();
  const state = store.getState();
  const operation = getFirstOperationWithID(state, operationID);
  const isLoading = isOperationStartedOrPending(operation, scopeID);
  const isCompleted = isOperationCompleted(operation, scopeID);
  const status = getOperationLastStatus(operation, scopeID);
  const error = getOperationLastError(operation, scopeID);
  const derivedProps: IOperationHelperDerivedProps = {
    operation,
    isLoading,
    isCompleted,
    isError: !!error,
    currentStatus: status
  };

  React.useEffect(() => {
    if (isFunction(loadFunc)) {
      loadFunc(derivedProps);
    }
  }, [loadFunc, operation, derivedProps]);

  if (isLoading) {
    return <Loading />;
  } else if (!!error) {
    return <GeneralError />;
  } else {
    return render(derivedProps);
  }
};

export default OperationHelper;
