import { Dispatch } from "redux";
import { getUserData } from "../../../net/user";
import {
  getUserTokenFromStorage,
  saveUserTokenToStorage
} from "../../../storage/userSession";
import OperationError from "../../../utils/operation-error/OperationError";
import { loginUserRedux, setSessionToWeb } from "../../session/actions";
import { IReduxState } from "../../store";
import { addUserRedux } from "../../users/actions";
import { setRootView } from "../../view/actions";
import { makeOrgsView } from "../../view/orgs";
import {
  dispatchOperationComplete,
  dispatchOperationError,
  dispatchOperationStarted,
  IDispatchOperationFuncProps,
  IOperationFuncOptions,
  isOperationStarted
} from "../operation";
import { initializeAppSessionOperationID } from "../operationIDs";
import { getOperationsWithID } from "../selectors";

export default async function initializeAppSessionOperationFunc(
  state: IReduxState,
  dispatch: Dispatch,
  dataProps: {},
  options: IOperationFuncOptions
) {
  const operations = getOperationsWithID(
    state,
    initializeAppSessionOperationID
  );

  if (operations[0] && isOperationStarted(operations[0], options.scopeID)) {
    return;
  }

  const dispatchOptions: IDispatchOperationFuncProps = {
    ...options,
    dispatch,
    operationID: initializeAppSessionOperationID
  };

  dispatchOperationStarted(dispatchOptions);

  try {
    const token = getUserTokenFromStorage();

    if (token) {
      const result = await getUserData(token);

      if (result && result.errors) {
        throw result.errors;
      }

      const { user, token: userToken } = result;

      saveUserTokenToStorage(userToken);
      dispatch(addUserRedux(user));
      dispatch(setRootView(makeOrgsView()));
      dispatch(loginUserRedux(userToken, user.customId));

      saveUserTokenToStorage(userToken);
    } else {
      dispatch(setSessionToWeb());
    }

    dispatchOperationComplete(dispatchOptions);
  } catch (error) {
    const transformedError = OperationError.fromAny(error);

    dispatch(setSessionToWeb());
    dispatchOperationError({ ...dispatchOptions, error: transformedError });
  }
}
