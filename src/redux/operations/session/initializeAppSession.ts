import { Dispatch } from "redux";
import { getUserData } from "../../../net/user";
import {
  getUserTokenFromStorage,
  saveUserTokenInStorage
} from "../../../storage/userSession";
import OperationError from "../../../utils/operation-error/OperationError";
import { loginUserRedux, setSessionToWeb } from "../../session/actions";
import { IReduxState } from "../../store";
import { addUserRedux } from "../../users/actions";
import {
  dispatchOperationComplete,
  dispatchOperationError,
  dispatchOperationStarted,
  isOperationStarted
} from "../operation";
import { initializeAppSessionOperationID } from "../operationIDs";
import { getOperationsWithID } from "../selectors";

export default async function initializeAppSessionOperation(
  state: IReduxState,
  dispatch: Dispatch
) {
  const operations = getOperationsWithID(
    state,
    initializeAppSessionOperationID
  );

  if (operations[0] && isOperationStarted(operations[0])) {
    return;
  }

  dispatchOperationStarted(dispatch, initializeAppSessionOperationID);

  try {
    const token = getUserTokenFromStorage();

    if (token) {
      const result = await getUserData(token);

      if (result && result.errors) {
        throw result.errors;
      }

      const { user, token: userToken } = result;

      saveUserTokenInStorage(userToken);
      dispatch(addUserRedux(user));
      dispatch(loginUserRedux(userToken, user.customId));
    } else {
      dispatch(setSessionToWeb());
    }

    dispatchOperationComplete(dispatch, initializeAppSessionOperationID);
  } catch (error) {
    const transformedError = OperationError.fromAny(error);
    dispatch(setSessionToWeb());
    dispatchOperationError(
      dispatch,
      initializeAppSessionOperationID,
      null,
      transformedError
    );
  }
}
