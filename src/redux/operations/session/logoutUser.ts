import { createAsyncThunk } from "@reduxjs/toolkit";
import UserSessionStorageFuncs from "../../../storage/userSession";
import SessionActions from "../../session/actions";
import { IAppAsyncThunkConfig } from "../../types";

// export const logoutUserOperationAction = createAsyncThunk<
//   void,
//   void,
//   IAppAsyncThunkConfig
// >("sessionOperation/logoutUser", (arg, thunkAPI) => {
//   console.error("PPP");
//   UserSessionStorageFuncs.deleteUserToken();
//   thunkAPI.dispatch(SessionActions.logoutUser());
// });

export const logoutUserOperationAction = () => {
  UserSessionStorageFuncs.deleteUserToken();
  return SessionActions.logoutUser();
};
