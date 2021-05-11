import { createAsyncThunk } from "@reduxjs/toolkit";
import unsubcribeEvent from "../../../net/socket/outgoing/unsubscribeEvent";
import UserAPI from "../../../net/user/user";
import UserSessionStorageFuncs from "../../../storage/userSession";
import SessionActions from "../../session/actions";
import { IAppAsyncThunkConfig } from "../../types";

export const logoutUserOpAction = createAsyncThunk<
    void,
    void,
    IAppAsyncThunkConfig
>("op/session/loginUser", async (arg, thunkAPI) => {
    // TODO: we are attempting to unsubscribe from all subscribed
    // resources, cause unsubscribing through the components that
    // subscribed to them causes an error, cause the user is logged
    // out and the token is deleted from the store.
    // Socket events require user token to run.
    await unsubcribeEvent();
    await UserAPI.updateClient({ data: { isLoggedIn: false } });
    UserSessionStorageFuncs.deleteUserToken();
    thunkAPI.dispatch(SessionActions.logoutUser());
});
