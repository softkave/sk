import { IChat } from "../../models/chat/types";
import { IAppState } from "../types";

function getChat(state: IAppState, chatId: string) {
    return state.chats[chatId];
}

function getChatsAsArray(state: IAppState, ids: string[]) {
    return ids.reduce((chats, id) => {
        if (state.chats[id]) {
            chats.push(state.chats[id]);
        }

        return chats;
    }, [] as IChat[]);
}

export default class ChatSelectors {
    public static getChat = getChat;
    public static getChats = getChatsAsArray;
}
