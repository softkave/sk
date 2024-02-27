import randomColor from "randomcolor";
import { isAnonymousUserId } from "../../../models/app/utils";
import { IClient } from "../../../models/user/types";
import UserAPI, { IUserLoginResult } from "../../../net/user/user";
import UserSessionStorageFuncs, { sessionVariables } from "../../../storage/userSession";
import SessionActions from "../../session/actions";
import { IStoreLikeObject } from "../../types";
import UserActions from "../../users/actions";
import { makeAsyncOp02NoPersist } from "../utils";

export interface ISignupUserOperationActionArgs {
  name: string;
  email: string;
  password: string;
}

export const signupUserOpAction = makeAsyncOp02NoPersist(
  "op/session/signupUser",
  async (arg: ISignupUserOperationActionArgs, thunkAPI) => {
    const data = { ...arg, color: randomColor() };
    const result = await UserAPI.signup({
      user: {
        color: data.color,
        email: data.email,
        name: data.name,
        password: data.password,
      },
    });

    if (result && result.errors) {
      throw result.errors;
    } else if (result && result.token && result.user) {
      // TODO: should we save the user token after signup or only after login?
      completeUserLogin(thunkAPI, result, true);
    } else {
      throw new Error("An error occurred");
    }
  }
);

export function localStoreClientData(client: IClient) {
  // TODO: we should ideally send the current client data to the server if set
  // if the clientIds don't match
  UserSessionStorageFuncs.setItem(sessionVariables.clientId, client.customId);
  UserSessionStorageFuncs.setItem(
    sessionVariables.hasUserSeenNotificationsPermissionDialog,
    client.hasUserSeenNotificationsPermissionDialog
  );
  UserSessionStorageFuncs.setItem(
    sessionVariables.muteChatNotifications,
    client.muteChatNotifications
  );
  UserSessionStorageFuncs.setItem(
    sessionVariables.isSubcribedToPushNotifications,
    client.isSubcribedToPushNotifications
  );
}

export function completeUserLogin(
  store: IStoreLikeObject,
  result: IUserLoginResult,
  remember: boolean,
  rememberOnlyIfTokenExists?: boolean,
  isAnonymousUserToken = false
) {
  store.dispatch(
    UserActions.update({
      id: result.user.customId,
      data: result.user,
      meta: { arrayUpdateStrategy: "replace" },
    })
  );
  store.dispatch(
    SessionActions.loginUser({
      token: result.token,
      userId: result.user.customId,
      client: result.client,
    })
  );

  if (remember) {
    if (isAnonymousUserToken || isAnonymousUserId(result.user.customId)) {
      UserSessionStorageFuncs.saveAnonymousUserToken(result.token);
    } else {
      UserSessionStorageFuncs.saveUserToken(result.token);
    }
  } else if (rememberOnlyIfTokenExists) {
    UserSessionStorageFuncs.saveTokenIfExists(result.token);
  }

  if (result.client) {
    localStoreClientData(result.client);
  }
}
