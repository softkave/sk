import { appConstants } from "../../../models/app/constants";
import UserAPI from "../../../net/user/user";
import { assertEndpointResult } from "../../../net/utils";
import UserSessionStorageFuncs from "../../../storage/userSession";
import SessionActions from "../../session/actions";
import { SessionType } from "../../session/types";
import { makeAsyncOp02 } from "../utils";
import { initDemoUserOpAction } from "./initDemoUser";
import { newAnonymousUserOpAction } from "./newAnonymousUser";
import { completeUserLogin } from "./signupUser";

export const initializeAppSessionOpAction = makeAsyncOp02(
  "op/session/initializeAppSession",
  async (arg, thunkAPI) => {
    thunkAPI.dispatch(SessionActions.setSession(SessionType.Initializing));
    const searchParams = new URLSearchParams(window.location.search);
    const isDemoMode = searchParams.has(appConstants.demoQueryKey) as boolean;
    if (isDemoMode) {
      await thunkAPI.dispatch(initDemoUserOpAction());
    } else {
      const token = UserSessionStorageFuncs.getUserToken();
      if (token) {
        try {
          const result = await UserAPI.getUserData({ token });
          assertEndpointResult(result);
          completeUserLogin(thunkAPI, result, true);
        } catch (error) {
          UserSessionStorageFuncs.deleteLoggedInUserToken();
        }
      } else {
        await thunkAPI.dispatch(newAnonymousUserOpAction());
      }
    }

    thunkAPI.dispatch(SessionActions.setSession(SessionType.Initialized));
  }
);
