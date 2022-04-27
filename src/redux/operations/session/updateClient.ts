import { createAsyncThunk } from "@reduxjs/toolkit";
import { IClient, IPersistedClient } from "../../../models/user/user";
import UserAPI from "../../../net/user/user";
import UserSessionStorageFuncs, {
  sessionVariables,
} from "../../../storage/userSession";
import { getFields, makeExtract } from "../../../utils/extract";
import { getNewId, mergeData } from "../../../utils/utils";
import SessionActions from "../../session/actions";
import SessionSelectors from "../../session/selectors";
import { IAppAsyncThunkConfig } from "../../types";
import {
  dispatchOperationCompleted,
  dispatchOperationError,
  dispatchOperationStarted,
  IOperation,
  isOperationStarted,
  wrapUpOpAction,
} from "../operation";
import OperationType from "../OperationType";
import OperationSelectors from "../selectors";
import { GetOperationActionArgs } from "../types";
import { localStoreClientData } from "./signupUser";

const clientInputFields = getFields<Omit<IPersistedClient, "clientId">>({
  hasUserSeenNotificationsPermissionDialog: true,
  isLoggedIn: true,
  muteChatNotifications: true,
});

export const clientInputExtractor = makeExtract(clientInputFields);
export const updateClientOpAction = createAsyncThunk<
  IOperation | undefined,
  GetOperationActionArgs<{
    data: Omit<IClient, "clientId">;
  }>,
  IAppAsyncThunkConfig
>("op/session/updateClient", async (arg, thunkAPI) => {
  const opId = arg.opId || getNewId();
  const operation = OperationSelectors.getOperationWithId(
    thunkAPI.getState(),
    opId
  );

  if (isOperationStarted(operation)) {
    return;
  }

  thunkAPI.dispatch(dispatchOperationStarted(opId, OperationType.UpdateClient));

  try {
    const data = clientInputExtractor(arg.data);
    const savedClient = SessionSelectors.assertGetClient(thunkAPI.getState());
    let client = mergeData({ ...savedClient }, arg.data);

    if (Object.keys(data).length > 0) {
      const result = await UserAPI.updateClient({
        data: arg.data,
      });

      if (result && result.errors) {
        throw result.errors;
      }

      client = mergeData(client, result.client);
    }

    UserSessionStorageFuncs.setItem(sessionVariables.clientId, client.clientId);
    localStoreClientData(client);
    thunkAPI.dispatch(SessionActions.updateClient(client));
    thunkAPI.dispatch(
      dispatchOperationCompleted(opId, OperationType.UpdateClient)
    );
  } catch (error) {
    thunkAPI.dispatch(
      dispatchOperationError(opId, OperationType.UpdateClient, error)
    );
  }

  return wrapUpOpAction(thunkAPI, opId, arg);
});
