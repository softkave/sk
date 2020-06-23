import { createAsyncThunk } from "@reduxjs/toolkit";
import UserSessionStorageFuncs from "../../../storage/userSession";
import SessionActions from "../../session/actions";
import { IAppAsyncThunkConfig } from "../../types";

export const logoutUserOperationAction = createAsyncThunk<
  void,
  void,
  IAppAsyncThunkConfig
>("session/logoutUser", (arg, thunkAPI) => {
  UserSessionStorageFuncs.deleteUserToken();
  thunkAPI.dispatch(SessionActions.logoutUser());
});
