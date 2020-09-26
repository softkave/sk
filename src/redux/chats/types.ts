import { IChat } from "../../models/chat/types";

export interface IChatsState {
    [key: string]: IChat;
}
