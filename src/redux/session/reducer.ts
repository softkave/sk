import { createReducer } from "@reduxjs/toolkit";
import { mergeData } from "../../utils/utils";
import SessionActions from "./actions";
import { ISessionState, SessionType } from "./types";

const sessionReducer = createReducer<ISessionState>(
    { sessionType: SessionType.Uninitialized },
    (builder) => {
        builder.addCase(SessionActions.loginUser, (state, action) => {
            state.sessionType = SessionType.App;
            state.token = action.payload.token;
            state.userId = action.payload.userId;
            state.isDemo = action.payload.isDemo;
            state.client = action.payload.client;
        });

        builder.addCase(SessionActions.setSessionToWeb, (state) => {
            return { sessionType: SessionType.Web };
        });

        builder.addCase(SessionActions.updateClient, (state, action) => {
            state.client = mergeData(state.client, action.payload);
        });

        builder.addCase(SessionActions.logoutUser, (state) => {
            return { sessionType: SessionType.Web };
        });
    }
);

export default sessionReducer;
