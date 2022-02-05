import React from "react";
import { IChat } from "../../models/chat/types";
import { ICollaborator } from "../../models/collaborator/types";
import { IUser } from "../../models/user/user";
import { default as AppMessage } from "../Message";
import StyledContainer from "../styled/Container";
import Chat from "./Chat";

export interface IChatListProps {
  chats: IChat[];
  recipientsMap: { [key: string]: ICollaborator };
  user: IUser;
}

const ChatList: React.FC<IChatListProps> = (props) => {
  const { chats, recipientsMap, user } = props;
  const parentRef = React.useRef<HTMLDivElement>();
  React.useEffect(() => {
    if (parentRef.current && chats.length > 0) {
      if (!parentRef.current) {
        return;
      }

      parentRef.current.scrollTop = (
        parentRef.current as HTMLDivElement
      ).scrollHeight;
    }
  }, [chats.length]);

  if (chats.length === 0) {
    return (
      <AppMessage message="Write a message and press the enter button to send." />
    );
  }

  let hideAvatarCheck: { [key: string]: boolean } = {};
  return (
    // @ts-ignore
    <div ref={parentRef}>
      {chats.map((chat, i) => {
        const sender = recipientsMap[chat.sender];
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
              sender={sender}
              hideAvatar={hideAvatarCheck[chat.sender]}
              isUserSender={sender.customId === user.customId}
            />
          </StyledContainer>
        );

        hideAvatarCheck = { [chat.sender]: true };
        return chatRender;
      })}
    </div>
  );
};

export default ChatList;
