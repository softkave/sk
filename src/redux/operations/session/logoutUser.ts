import unsubcribeEvent from "../../../net/socket/outgoing/unsubscribeEvent";
import UserAPI from "../../../net/user/user";
import UserSessionStorageFuncs from "../../../storage/userSession";
import SessionActions from "../../session/actions";
import { makeAsyncOp02NoPersist } from "../utils";

export const logoutUserOpAction = makeAsyncOp02NoPersist(
  "op/session/loginUser",
  async (arg: undefined, thunkAPI) => {
    try {
      // TODO: we are attempting to unsubscribe from all subscribed
      // resources, cause unsubscribing through the components that
      // subscribed to them causes an error, cause the user is logged
      // out and the token is deleted from the store.
      // Socket events require user token to run.
      await unsubcribeEvent();

      // TODO: is there a better way, cause if this call fails,
      // we would think the user is still logged in
      // to the server on the server-side
      await UserAPI.updateClient({ data: { isLoggedIn: false } });
    } catch (error) {
      // TODO: log to server
    }

    UserSessionStorageFuncs.deleteUserVariables();
    thunkAPI.dispatch(SessionActions.logoutUser());
  }
);
