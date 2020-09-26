import { createAction } from "@reduxjs/toolkit";
import { IChat } from "../../models/chat/types";
import { IMergeDataMeta } from "../../utils/utils";

const addChat = createAction<IChat>("chats/addChat");

export interface IUpdateChatActionArgs {
    id: string;
    data: Partial<IChat>;
    meta?: IMergeDataMeta;
}

const updateChat = createAction<IUpdateChatActionArgs>("chats/updateChat");

const deleteChat = createAction<string>("chats/deleteChat");

const bulkAddChats = createAction<IChat[]>("chats/bulkAddChats");

const bulkUpdateChats = createAction<IUpdateChatActionArgs[]>(
    "chats/bulkUpdateChats"
);

const bulkDeleteChats = createAction<string[]>("chats/bulkDeleteChats");

class ChatActions {
    public static addChat = addChat;
    public static updateChat = updateChat;
    public static deleteChat = deleteChat;
    public static bulkAddChats = bulkAddChats;
    public static bulkUpdateChats = bulkUpdateChats;
    public static bulkDeleteChats = bulkDeleteChats;
}

export default ChatActions;
