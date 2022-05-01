import React from "react";
import { Redirect } from "react-router-dom";
import { appOrganizationPaths } from "../../models/app/routes";
import ChatRoom from "./ChatRoom";
import useChatRooms from "./useChatRooms";

export interface IChatRoomContainerProps {
  orgId: string;
  recipientId: string;
}

const ChatRoomContainer: React.FC<IChatRoomContainerProps> = (props) => {
  const { orgId, recipientId } = props;
  const {
    isAppHidden,
    sortedRooms,
    recipientsMap,
    onSendMessage,
    updateRoomReadCounter,
    user,
  } = useChatRooms({ orgId });

  const room = sortedRooms.find((rm) => rm.recipientId === recipientId)!;

  if (!room) {
    return <Redirect to={appOrganizationPaths.chats(orgId)} />;
  }

  return (
    <ChatRoom
      isAppHidden={isAppHidden}
      user={user}
      room={room}
      recipientsMap={recipientsMap}
      onSendMessage={onSendMessage}
      updateRoomReadCounter={updateRoomReadCounter}
    />
  );
};

export default ChatRoomContainer;
