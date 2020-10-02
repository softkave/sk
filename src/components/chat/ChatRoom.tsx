import React from "react";
import { IRoom } from "../../models/chat/types";
import {
    ISendMessageAPIParameters,
    IUpdateRoomReadCounterAPIParameters,
} from "../../net/chat";

export interface IChatRoomProps {
    room: IRoom;
    updateRoomReadCounter: (args: IUpdateRoomReadCounterAPIParameters) => void;
    onSendMessage: (args: Required<ISendMessageAPIParameters>) => void;
}

const ChatRoom: React.FC<IChatRoomProps> = (props) => {
    return null;
};

export default React.memo(ChatRoom);
