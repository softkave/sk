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

    const ref = React.useRef<typeof Scrollbar>();

    React.useEffect(() => {
        if (ref.current) {
            ((ref.current as unknown) as ScrollbarMethods)?.scrollToBottom();
        }
    }, []);

    if (chats.length === 0) {
        return <EmptyMessage>Send a message to begin</EmptyMessage>;
    }

    let hideAvatarCheck: { [key: string]: boolean } = {};

    return (
        <StyledContainer s={{ flexDirection: "column", padding: "16px" }}>
            <Scrollbar>
                {chats.map((chat, i) => {
                    const chatRender = (
                        <StyledContainer
                            key={i}
                            s={{
                                marginBottom: i < chats.length - 1 ? "16px" : 0,
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
        </StyledContainer>
    );
};

export default ChatList;
