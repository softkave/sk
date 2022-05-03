import React from "react";
import { IChat } from "../../models/chat/types";
import { ICollaborator } from "../../models/collaborator/types";
import { IUser } from "../../models/user/user";
import { default as AppMessage } from "../Message";
import Chat from "./Chat";

export interface IChatListProps {
  chats: IChat[];
  recipient: ICollaborator;
  user: IUser;
}

// TODO: implement skipping to the last unread message

const ChatList: React.FC<IChatListProps> = (props) => {
  const { chats, recipient, user } = props;
  const parentRef = React.useRef<HTMLDivElement>(null);
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
    <div ref={parentRef} style={{ width: "100%" }}>
      {chats.map((chat, i) => {
        const sender = chat.sender === user.customId ? user : recipient;
        const chatRender = (
          <div
            key={i}
            style={{
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
          </div>
        );

        hideAvatarCheck = { [chat.sender]: true };
        return chatRender;
      })}
    </div>
  );
};

export default ChatList;
