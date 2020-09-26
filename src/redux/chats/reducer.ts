import { createReducer } from "@reduxjs/toolkit";
import { mergeData } from "../../utils/utils";
import SessionActions from "../session/actions";
import ChatActions from "./actions";
import { IChatsState } from "./types";

const chatsReducer = createReducer<IChatsState>({}, (builder) => {
    builder.addCase(ChatActions.addChat, (state, action) => {
        state[action.payload.customId] = action.payload;
    });

    builder.addCase(ChatActions.updateChat, (state, action) => {
        state[action.payload.id] = mergeData(
            state[action.payload.id],
            action.payload.data,
            action.payload.meta
        );
    });

    builder.addCase(ChatActions.deleteChat, (state, action) => {
        delete state[action.payload];
    });

    builder.addCase(ChatActions.bulkAddChats, (state, action) => {
        action.payload.forEach((chat) => (state[chat.customId] = chat));
    });

    builder.addCase(ChatActions.bulkUpdateChats, (state, action) => {
        action.payload.forEach((param) => {
            state[param.id] = mergeData(
                state[param.id],
                param.data,
                param.meta
            );
        });
    });

    builder.addCase(ChatActions.bulkDeleteChats, (state, action) => {
        action.payload.forEach((id) => delete state[id]);
    });

    builder.addCase(SessionActions.logoutUser, (state) => {
        return {};
    });
});

export default chatsReducer;
