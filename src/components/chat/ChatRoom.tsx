import React from "react";
import { IRoom } from "../../models/chat/types";
import { IUser } from "../../models/user/user";
import {
    ISendMessageAPIParameters,
    IUpdateRoomReadCounterAPIParameters,
} from "../../net/chat";
import { getDateString } from "../../utils/utils";
import StyledContainer from "../styled/Container";
import ChatInput from "./ChatInput";
import ChatList from "./ChatList";
import ChatRoomHeader from "./ChatRoomHeader";

export interface IChatRoomProps {
    room: IRoom;
    recipientsMap: { [key: string]: IUser };
    updateRoomReadCounter: (args: IUpdateRoomReadCounterAPIParameters) => void;
    onSendMessage: (args: Required<ISendMessageAPIParameters>) => void;
}

const ChatRoom: React.FC<IChatRoomProps> = (props) => {
    const { room, recipientsMap, updateRoomReadCounter, onSendMessage } = props;

    React.useEffect(() => {
        const unseenChatsCount = room.unseenChatsStartIndex
            ? room.chats.length - room.unseenChatsStartIndex - 1
            : 0;

        if (unseenChatsCount > 0) {
            updateRoomReadCounter({
                orgId: room.orgId,
                roomId: room.customId,
                readCounter: getDateString(),
            });
        }
    }, []);

    const sendMessage = (message: string) => {
        onSendMessage({
            message,
            orgId: room.orgId,
            recipientId: room.recipientId,
            roomId: room.customId,
        });
    };

    return (
        <StyledContainer s={{ flexDirection: "column", width: "100%" }}>
            <ChatRoomHeader recipient={recipientsMap[room.recipientId]} />
            <StyledContainer s={{ flex: 1 }}>
                <ChatList chats={room.chats} recipientsMap={recipientsMap} />
            </StyledContainer>
            <ChatInput onSendMessage={sendMessage} />
        </StyledContainer>
    );
};

export default React.memo(ChatRoom);
