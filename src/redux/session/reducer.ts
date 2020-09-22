import { createReducer } from "@reduxjs/toolkit";
import SessionActions from "./actions";
import { ISessionState, SessionType } from "./types";

const sessionReducer = createReducer<ISessionState>(
    { sessionType: SessionType.Uninitialized },
    (builder) => {
        builder.addCase(SessionActions.loginUser, (state, action) => {
            state.sessionType = SessionType.App;
            state.token = action.payload.token;
            state.userId = action.payload.userId;
            state.clientId = action.payload.clientId;
            state.isDemo = action.payload.isDemo;
        });

        builder.addCase(SessionActions.setSessionToWeb, (state) => {
            return { sessionType: SessionType.Web };
        });

        builder.addCase(SessionActions.logoutUser, (state) => {
            return { sessionType: SessionType.Web };
        });
    }
);

export default sessionReducer;
