import { getUserData } from "../../../net/user";
import {
  getUserTokenFromStorage,
  saveUserTokenToStorage
} from "../../../storage/userSession";
import OperationError from "../../../utils/operation-error/OperationError";
import { loginUserRedux, setSessionToWeb } from "../../session/actions";
import { addUserRedux } from "../../users/actions";
import { setDefaultView } from "../../view/actions";
import { IOperationFuncOptions } from "../operation";
import { initializeAppSessionOperationID } from "../operationIDs";
import operationWrapper from "../operationWrapper";

export default async function initializeAppSessionOperationFunc(
  options: IOperationFuncOptions = {}
) {
  const main = () => {
    return async (dispatch, getState) => {
      const token = getUserTokenFromStorage();

      if (token) {
        const result = await getUserData(token);

        if (result && result.errors) {
          throw result.errors;
        }

        const { user, token: userToken } = result;

        saveUserTokenToStorage(userToken);
        dispatch(addUserRedux(user));
        dispatch(setDefaultView());
        dispatch(loginUserRedux(userToken, user.customId));

        saveUserTokenToStorage(userToken);
      } else {
        dispatch(setSessionToWeb());
      }
    };
  };

  const onError = error => {
    return (dispatch, getState) => {
      dispatch(setSessionToWeb());
      return OperationError.fromAny(error);
    };
  };

  return async (dispatch, getState) => {
    return dispatch(
      operationWrapper({
        main,
        onError,
        operationID: initializeAppSessionOperationID,
        scopeID: options.scopeID
      })
    );
  };
}
