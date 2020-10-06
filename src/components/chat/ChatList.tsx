import React from "react";
import { IChat } from "../../models/chat/types";
import { IUser } from "../../models/user/user";
import EmptyMessage from "../EmptyMessage";
import StyledContainer from "../styled/Container";
import Chat from "./Chat";

export interface IChatListProps {
    chats: IChat[];
    recipientsMap: { [key: string]: IUser };
}

const ChatList: React.FC<IChatListProps> = (props) => {
    const { chats, recipientsMap } = props;

    if (chats.length === 0) {
        return <EmptyMessage>Send a message to begin</EmptyMessage>;
    }

    let hideAvatarCheck: { [key: string]: boolean } = {};

    return (
        <StyledContainer>
            {chats.map((chat, i) => {
                const chatRender = (
                    <Chat
                        key={i}
                        chat={chat}
                        sender={recipientsMap[chat.sender]}
                        hideAvatar={hideAvatarCheck[chat.sender]}
                    />
                );

                hideAvatarCheck = { [chat.sender]: true };
                return chatRender;
            })}
        </StyledContainer>
    );
};

export default ChatList;
