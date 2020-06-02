import isFunction from "lodash/isFunction";
import React from "react";
import { useSelector, useStore } from "react-redux";
import IOperation, {
  getOperationLastError,
  getOperationLastStatus,
  IOperationStatus,
  isOperationCompleted,
  isOperationStartedOrPending,
} from "../redux/operations/operation";
import {
  getFirstOperationWithId,
  getOperationWithIdForResource,
} from "../redux/operations/selectors";
import { IAppState } from "../redux/store";
import GeneralError from "./GeneralError";
import Loading from "./Loading";

export interface ISingleOperationHelperDerivedProps {
  isLoading: boolean;
  isError: boolean;
  isCompleted: boolean;
  state: IAppState;
  error?: any;
  operation?: IOperation;
  currentStatus?: IOperationStatus;
}

export interface IOperationHelperProps {
  operationId: string;
  render: (
    props: ISingleOperationHelperDerivedProps
  ) => React.ReactElement | null;
  resourceId?: string;
  scopeId?: string;
  dontManageRender?: boolean;
  loadFunc?: (props: ISingleOperationHelperDerivedProps) => void;
}

const SingleOperationHelper: React.FC<IOperationHelperProps> = (props) => {
  const {
    operationId,
    render,
    loadFunc,
    scopeId,
    dontManageRender,
    resourceId,
  } = props;
  const store = useStore<IAppState>();
  const operation = useSelector<IAppState, IOperation | undefined>((state) =>
    resourceId
      ? getOperationWithIdForResource(state, operationId, resourceId)
      : getFirstOperationWithId(state, operationId)
  );
  const isLoading = isOperationStartedOrPending(operation, scopeId);
  const isCompleted = isOperationCompleted(operation, scopeId);
  const status = getOperationLastStatus(operation, scopeId);
  const error = getOperationLastError(operation, scopeId);
  const derivedProps: ISingleOperationHelperDerivedProps = {
    operation,
    isLoading,
    isCompleted,
    error,
    isError: !!error,
    currentStatus: status,
    state: store.getState(),
  };

  React.useEffect(() => {
    if (isFunction(loadFunc)) {
      loadFunc({
        ...derivedProps,
        state: store.getState(),
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
