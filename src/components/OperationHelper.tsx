import isFunction from "lodash/isFunction";
import React from "react";
import { useSelector, useStore } from "react-redux";
import IOperation, {
  getOperationLastError,
  getOperationLastStatus,
  IOperationStatus,
  isOperationCompleted,
  isOperationStartedOrPending
} from "../redux/operations/operation";
import {
  getFirstOperationWithID,
  getOperationWithIDForResource
} from "../redux/operations/selectors";
import { IReduxState } from "../redux/store";
import GeneralError from "./GeneralError";
import Loading from "./Loading";

export interface ISingleOperationHelperDerivedProps {
  isLoading: boolean;
  isError: boolean;
  isCompleted: boolean;
  state: IReduxState;
  error?: any;
  operation?: IOperation;
  currentStatus?: IOperationStatus;
}

export interface IOperationHelperProps {
  operationID: string;
  render: (
    props: ISingleOperationHelperDerivedProps
  ) => React.ReactElement | null;
  resourceID?: string;
  scopeID?: string;
  dontManageRender?: boolean;
  loadFunc?: (props: ISingleOperationHelperDerivedProps) => void;
}

const SingleOperationHelper: React.FC<IOperationHelperProps> = props => {
  const {
    operationID,
    render,
    loadFunc,
    scopeID,
    dontManageRender,
    resourceID
  } = props;
  const store = useStore<IReduxState>();
  const operation = useSelector<IReduxState, IOperation | undefined>(state =>
    resourceID
      ? getOperationWithIDForResource(state, operationID, resourceID)
      : getFirstOperationWithID(state, operationID)
  );
  const isLoading = isOperationStartedOrPending(operation, scopeID);
  const isCompleted = isOperationCompleted(operation, scopeID);
  const status = getOperationLastStatus(operation, scopeID);
  const error = getOperationLastError(operation, scopeID);
  const derivedProps: ISingleOperationHelperDerivedProps = {
    operation,
    isLoading,
    isCompleted,
    error,
    isError: !!error,
    currentStatus: status,
    state: store.getState()
  };

  React.useEffect(() => {
    if (isFunction(loadFunc)) {
      loadFunc({
        ...derivedProps,
        state: store.getState()
      });
    }
  }, [loadFunc, derivedProps, store]);

  const managedRender = () => {
    if (isLoading || operation === undefined || operation === null) {
      return <Loading />;
    } else if (!!error) {
      return <GeneralError error={error} />;
    } else {
      return render(derivedProps);
    }
  };

  if (dontManageRender) {
    return render(derivedProps);
  }

  return managedRender();
};

export default SingleOperationHelper;
