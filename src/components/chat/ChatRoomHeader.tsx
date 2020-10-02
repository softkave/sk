import React from "react";
import { IUser } from "../../models/user/user";

export interface IChatRoomHeaderProps {
    recipient: IUser;
}

const ChatRoomHeader: React.FC<IChatRoomHeaderProps> = (props) => {
    return null;
};

export default ChatRoomHeader;
