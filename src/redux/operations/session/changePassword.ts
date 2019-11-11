import { Dispatch } from "redux";
import { userErrorMessages } from "../../../models/user/userErrorMessages";
import * as userNet from "../../../net/user";
import OperationError from "../../../utils/operation-error/OperationError";
import { anErrorOccurred } from "../../../utils/operation-error/OperationErrorItem";
import { loginUserRedux } from "../../session/actions";
import { IReduxState } from "../../store";
import { addUserRedux } from "../../users/actions";
import { setDefaultView } from "../../view/actions";
import {
  dispatchOperationComplete,
  dispatchOperationError,
  dispatchOperationStarted,
  IDispatchOperationFuncProps,
  IOperationFuncOptions,
  isOperationStarted
} from "../operation";
import { changePasswordOperationID } from "../operationIDs";
import { getFirstOperationWithID } from "../selectors";
import { saveUserTokenIfAlreadySaved } from "./utils";

export interface IChangePasswordOperationFuncDataProps {
  // email: string;
  password: string;
  token?: string;
}

export default async function changePasswordOperationFunc(
  state: IReduxState,
  dispatch: Dispatch,
  dataProps: IChangePasswordOperationFuncDataProps,
  options: IOperationFuncOptions = {}
) {
  const { password, token } = dataProps;
  const dispatchOptions: IDispatchOperationFuncProps = {
    ...options,
    dispatch,
    operationID: changePasswordOperationID
  };

  if (!token) {
    dispatchOperationError({
      ...dispatchOptions,
      error: OperationError.fromAny(
        new Error(userErrorMessages.invalidCredentials)
      )
    });

    return;
  }

  const operation = getFirstOperationWithID(state, changePasswordOperationID);

  if (isOperationStarted(operation, options.scopeID)) {
    return;
  }

  dispatchOperationStarted(dispatchOptions);

  try {
    // TODO: define type
    let result: any = null;

    if (token) {
      result = await userNet.changePasswordWithToken({
        password,
        token
      });
    } else {
      result = await userNet.changePassword({
        password,
        token
      });
    }

    if (result && result.errors) {
      throw result.errors;
    } else if (result && result.token && result.user) {
      dispatch(addUserRedux(result.user));
      dispatch(setDefaultView());
      dispatch(loginUserRedux(result.token, result.user.customId));

      saveUserTokenIfAlreadySaved(result.token);
    } else {
      throw anErrorOccurred;
    }

    dispatchOperationComplete(dispatchOptions);
  } catch (error) {
    const err = OperationError.fromAny(error);

    dispatchOperationError({ ...dispatchOptions, error: err });
  }
}
