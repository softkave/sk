import { appMessages } from "../../../models/messages";
import UserAPI, { IUpdateUserAPIProps } from "../../../net/user/user";
import SessionSelectors from "../../session/selectors";
import UserActions from "../../users/actions";
import { makeAsyncOp02NoPersist } from "../utils";
import { completeUserLogin } from "./signupUser";

export const updateUserOpAction = makeAsyncOp02NoPersist(
  "op/session/updateUser",
  async (arg: IUpdateUserAPIProps, thunkAPI, extras) => {
    if (extras.isAnonymousUser) {
      throw new Error("Cannot update anonymous users");
    }

    if (extras.isDemoMode) {
      const userId = SessionSelectors.getUserId(thunkAPI.getState());
      if (userId) {
        await thunkAPI.dispatch(
          UserActions.update({
            id: userId,
            data: arg.data,
            meta: { arrayUpdateStrategy: "replace" },
          })
        );
      }
    } else {
      const result = await UserAPI.updateUser({
        data: arg.data,
      });

      if (result && result.errors) {
        throw result.errors;
      } else if (result && result.token && result.user) {
        completeUserLogin(thunkAPI, result, false, true);
      } else {
        throw new Error(appMessages.anErrorOccurred);
      }
    }
  }
);
