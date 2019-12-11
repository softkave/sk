import { deleteUserTokenInStorage } from "../../../storage/userSession";
import { logoutUserRedux } from "../../session/actions";

export default async function logoutUserOperationFunc() {
  return dispatch => {
    deleteUserTokenInStorage();
    dispatch(logoutUserRedux());
  };
}
