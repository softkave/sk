import React from "react";
import { IChat } from "../../models/chat/types";

export interface IChatProps {
    chat: IChat;
}

const Chat: React.FC<IChatProps> = (props) => {
    return null;
};

export default React.memo(Chat);
