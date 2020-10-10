import React from "react";
import { IChat } from "../../models/chat/types";
import { IUser } from "../../models/user/user";
import EmptyMessage from "../EmptyMessage";
import StyledContainer from "../styled/Container";
import Scrollbar, { ScrollbarMethods } from "../utilities/Scrollbar";
import Chat from "./Chat";

export interface IChatListProps {
    chats: IChat[];
    recipientsMap: { [key: string]: IUser };
}

const ChatList: React.FC<IChatListProps> = (props) => {
    const { chats, recipientsMap } = props;

    const parentRef = React.useRef<ScrollbarMethods>();

    React.useEffect(() => {
        if (parentRef.current && chats.length > 0) {
            parentRef.current.scrollToBottom();
        }
    }, [chats.length]);

    if (chats.length === 0) {
        return (
            <EmptyMessage>
                Write a message and press the enter button to send
            </EmptyMessage>
        );
    }

    let hideAvatarCheck: { [key: string]: boolean } = {};

    return (
        <Scrollbar ref={parentRef}>
            {chats.map((chat, i) => {
                const chatRender = (
                    <StyledContainer
                        key={i}
                        s={{
                            margin: "16px",
                            marginTop: i === 0 ? "16px" : 0,
                        }}
                    >
                        <Chat
                            chat={chat}
                            sender={recipientsMap[chat.sender]}
                            hideAvatar={hideAvatarCheck[chat.sender]}
                        />
                    </StyledContainer>
                );

                hideAvatarCheck = { [chat.sender]: true };
                return chatRender;
            })}
        </Scrollbar>
    );
};

export default ChatList;
