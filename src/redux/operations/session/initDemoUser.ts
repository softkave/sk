import randomColor from "randomcolor";
import { appConstants } from "../../../models/app/constants";
import { SystemResourceType } from "../../../models/app/types";
import { IUserLoginResult } from "../../../net/user/user";
import UserSessionStorageFuncs, { sessionVariables } from "../../../storage/userSession";
import { getNewId, getNewId02 } from "../../../utils/ids";
import { getDateString } from "../../../utils/utils";
import SessionActions from "../../session/actions";
import { makeAsyncOp02NoPersist } from "../utils";
import { completeUserLogin } from "./signupUser";

export const initDemoUserOpAction = makeAsyncOp02NoPersist(
  "op/session/initDemoUser",
  async (arg: undefined, thunkAPI) => {
    const result: IUserLoginResult = {
      token: "",
      client: {
        customId: UserSessionStorageFuncs.getItem(sessionVariables.clientId) || getNewId(),
      },
      user: {
        email: appConstants.demoUserEmail,
        firstName: appConstants.demoUserFirstName,
        lastName: appConstants.demoUserLastName,
        color: randomColor(),
        createdAt: getDateString(),
        customId: getNewId02(SystemResourceType.DemoUser),
        workspaces: [],
      },
    };
    completeUserLogin(
      thunkAPI,
      result,
      /** remember */ false,
      /** rememberOnlyIfTokenExists */ false
    );
    await thunkAPI.dispatch(SessionActions.updateSession({ isDemo: true }));
  }
);
