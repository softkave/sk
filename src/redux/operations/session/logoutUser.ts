import { deleteUserTokenInStorage } from "../../../storage/userSession";
import { logoutUserRedux } from "../../session/actions";
import store from "../../store";

export default async function logoutUserOperationFunc() {
  deleteUserTokenInStorage();
  store.dispatch(logoutUserRedux());
}
