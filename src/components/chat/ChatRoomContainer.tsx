import React from "react";
import { Redirect } from "react-router-dom";
import { appOrganizationPaths } from "../../models/app/routes";
import MessageList from "../MessageList";
import LoadingEllipsis from "../utils/LoadingEllipsis";
import ChatRoom from "./ChatRoom";
import { useChatRoom } from "./useChatRoom";

export interface IChatRoomContainerProps {
  orgId: string;
  recipientId: string;
}

const ChatRoomContainer: React.FC<IChatRoomContainerProps> = (props) => {
  const { orgId, recipientId } = props;
  const { loading, error, room, recipient, onSendMessage, updateRoomReadCounter, user } =
    useChatRoom(orgId, recipientId);

  if (error) {
    return <MessageList maxWidth messages={error} />;
  } else if (loading) {
    return <LoadingEllipsis />;
  } else if (!room || !recipient) {
    return <Redirect to={appOrganizationPaths.chats(orgId)} />;
  }

  return (
    <ChatRoom
      user={user}
      room={room}
      recipient={recipient}
      onSendMessage={onSendMessage}
      updateRoomReadCounter={updateRoomReadCounter}
    />
  );
};

export default ChatRoomContainer;
