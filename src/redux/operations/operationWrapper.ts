import isFunction from "lodash/isFunction";
import { Action } from "redux";
import { ThunkAction } from "redux-thunk";
import { IReduxState } from "../store";
import { pushOperation } from "./actions";
import { defaultOperationStatusTypes, isOperationStarted } from "./operation";
import { getFirstOperationWithID } from "./selectors";

interface IOperationWrapperOptions {
  operationID: string;
  main: () => ThunkAction<any, IReduxState, any, Action>;
  onError: (error: any) => ThunkAction<any, IReduxState, any, Action>;
  resourceID?: string | null;
  scopeID?: string | number;
}

export default async function operationWrapper(
  options: IOperationWrapperOptions
) {
  const action: ThunkAction<
    any,
    IReduxState,
    IOperationWrapperOptions,
    Action
  > = async (dispatch, getState) => {
    const state = getState();
    const operation = getFirstOperationWithID(state, options.operationID);

    if (operation && isOperationStarted(operation, options.scopeID)) {
      return;
    }

    dispatch(
      pushOperation(
        options.operationID,
        {
          scopeID: options.scopeID,
          status: defaultOperationStatusTypes.operationStarted,
          timestamp: Date.now()
        },
        options.resourceID
      )
    );

    try {
      let result = null;

      if (isFunction(options.main)) {
        result = await dispatch(options.main());
      }

      dispatch(
        pushOperation(
          options.operationID,
          {
            data: result,
            scopeID: options.scopeID,
            status: defaultOperationStatusTypes.operationComplete,
            timestamp: Date.now()
          },
          options.resourceID
        )
      );
    } catch (error) {
      let finalError = error;

      if (isFunction(options.onError)) {
        finalError = options.onError(error);
      }

      dispatch(
        pushOperation(
          options.operationID,
          {
            error: finalError,
            scopeID: options.scopeID,
            status: defaultOperationStatusTypes.operationComplete,
            timestamp: Date.now()
          },
          options.resourceID
        )
      );
    }
  };

  return action;
}
