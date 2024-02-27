import { IClient, IPersistedClient } from "../../../models/user/types";
import UserAPI from "../../../net/user/user";
import UserSessionStorageFuncs, { sessionVariables } from "../../../storage/userSession";
import { getFields, makeExtract } from "../../../utils/extract";
import { mergeData } from "../../../utils/utils";
import SessionActions from "../../session/actions";
import SessionSelectors from "../../session/selectors";
import { makeAsyncOp02NoPersist } from "../utils";
import { localStoreClientData } from "./signupUser";

const clientInputFields = getFields<Omit<IPersistedClient, "customId">>({
  hasUserSeenNotificationsPermissionDialog: true,
  isLoggedIn: true,
  muteChatNotifications: true,
});

export const clientInputExtractor = makeExtract(clientInputFields);
export const updateClientOpAction = makeAsyncOp02NoPersist(
  "op/session/updateClient",
  async (
    arg: {
      data: Omit<IClient, "customId">;
    },
    thunkAPI,
    extras
  ) => {
    if (extras.isDemoMode) {
      return;
    }

    const data = clientInputExtractor(arg.data);
    const savedClient = SessionSelectors.assertGetClient(thunkAPI.getState());
    let client = mergeData({ ...savedClient }, arg.data);
    if (Object.keys(data).length > 0) {
      const result = await UserAPI.updateClient({ data: arg.data });
      if (result && result.errors) {
        throw result.errors;
      }

      client = mergeData(client, result.client);
    }

    UserSessionStorageFuncs.setItem(sessionVariables.clientId, client.customId);
    localStoreClientData(client);
    thunkAPI.dispatch(SessionActions.updateClient(client));
  }
);
