import isFunction from "lodash/isFunction";
import React from "react";
import { useSelector, useStore } from "react-redux";
import IOperation, {
  getOperationLastError,
  getOperationLastStatus,
  IOperationStatus,
  isOperationCompleted,
  isOperationStartedOrPending
} from "../../redux/operations/operation";
import { getFirstOperationWithID } from "../../redux/operations/selectors";
import { IReduxState } from "../../redux/store";

export interface IOHDerivedProps {
  isLoading: boolean;
  isError: boolean;
  isCompleted: boolean;
  state: IReduxState;
  operation?: IOperation;
  currentStatus?: IOperationStatus;
}

export interface IOperationHelperProps {
  operationID: string;
  render: (props: IOHDerivedProps) => React.ReactElement | null;
  scopeID?: string;
  loadFunc?: (props: IOHDerivedProps) => void;
}

const OH: React.SFC<IOperationHelperProps> = props => {
  const { operationID, render, loadFunc, scopeID } = props;
  const store = useStore<IReduxState>();
  const operation = useSelector<IReduxState, IOperation>(state =>
    getFirstOperationWithID(state, operationID)
  );
  const isLoading = isOperationStartedOrPending(operation, scopeID);
  const isCompleted = isOperationCompleted(operation, scopeID);
  const status = getOperationLastStatus(operation, scopeID);
  const error = getOperationLastError(operation, scopeID);
  const derivedProps: IOHDerivedProps = {
    operation,
    isLoading,
    isCompleted,
    isError: !!error,
    currentStatus: status,
    state: store.getState()
  };

  React.useEffect(() => {
    if (isFunction(loadFunc)) {
      loadFunc(derivedProps);
    }
  }, [loadFunc, operation, derivedProps]);

  return render(derivedProps);
};

export default OH;
