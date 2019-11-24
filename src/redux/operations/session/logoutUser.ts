import { Dispatch } from "redux";
import { deleteUserTokenInStorage } from "../../../storage/userSession";
import { logoutUserRedux } from "../../session/actions";
import { IReduxState } from "../../store";

export default async function logoutUserOperationFunc(
  state: IReduxState,
  dispatch: Dispatch
) {
  deleteUserTokenInStorage();
  dispatch(logoutUserRedux());
}
