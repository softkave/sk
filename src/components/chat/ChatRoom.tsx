import React from "react";
import { useHistory } from "react-router";
import { IRoom } from "../../models/chat/types";
import { IUser } from "../../models/user/user";
import {
    ISendMessageAPIParameters,
    IUpdateRoomReadCounterAPIParameters,
} from "../../net/chat/chat";
import { getDateString } from "../../utils/utils";
import StyledContainer from "../styled/Container";
import ChatInput from "./ChatInput";
import ChatList from "./ChatList";
import ChatRoomHeader from "./ChatRoomHeader";

export interface IChatRoomProps {
    room: IRoom;
    recipientsMap: { [key: string]: IUser };
    user: IUser;
    isAppHidden: boolean;
    updateRoomReadCounter: (args: IUpdateRoomReadCounterAPIParameters) => void;
    onSendMessage: (args: Required<ISendMessageAPIParameters>) => void;
}

const ChatRoom: React.FC<IChatRoomProps> = (props) => {
    const {
        isAppHidden,
        room,
        user,
        recipientsMap,
        updateRoomReadCounter,
        onSendMessage,
    } = props;

    const history = useHistory();

    React.useEffect(() => {
        if (room.unseenChatsCount > 0 && !isAppHidden) {
            updateRoomReadCounter({
                orgId: room.orgId,
                roomId: room.customId,
                readCounter: getDateString(),
            });
        }
    }, [
        room.unseenChatsStartIndex,
        room.customId,
        room.orgId,
        room.chats.length,
        room.unseenChatsCount,
        isAppHidden,
        updateRoomReadCounter,
    ]);

    const sendMessage = (message: string) => {
        onSendMessage({
            message,
            orgId: room.orgId,
            recipientId: room.recipientId,
            roomId: room.customId,
        });
    };

    const onBack = () => {
        history.push(`/app/orgs/${room.orgId}/chat`);
    };

    return (
        <StyledContainer s={{ flexDirection: "column", width: "100%" }}>
            <ChatRoomHeader
                recipient={recipientsMap[room.recipientId]}
                onBack={onBack}
            />
            <StyledContainer s={{ flex: 1, overflow: "hidden" }}>
                <ChatList
                    user={user}
                    chats={room.chats}
                    recipientsMap={recipientsMap}
                />
            </StyledContainer>
            <ChatInput onSendMessage={sendMessage} />
        </StyledContainer>
    );
};

export default React.memo(ChatRoom);
