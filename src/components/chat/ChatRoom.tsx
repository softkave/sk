import React from "react";
import { useHistory } from "react-router";
import { IRoom } from "../../models/chat/types";
import { ICollaborator } from "../../models/collaborator/types";
import { IUser } from "../../models/user/user";
import {
  ISendMessageEndpointParameters,
  IUpdateRoomReadCounterAPIParameters,
} from "../../net/chat/chat";
import { getDateString } from "../../utils/utils";
import ChatInput from "./ChatInput";
import ChatList from "./ChatList";
import ChatRoomHeader from "./ChatRoomHeader";

export interface IChatRoomProps {
  room: IRoom;
  recipient: ICollaborator;
  user: IUser;
  isAppHidden: boolean;
  updateRoomReadCounter: (args: IUpdateRoomReadCounterAPIParameters) => void;
  onSendMessage: (args: ISendMessageEndpointParameters) => void;
}

const ChatRoom: React.FC<IChatRoomProps> = (props) => {
  const {
    isAppHidden,
    room,
    recipient,
    user,
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
    room.customId,
    room.orgId,
    room.chats.length,
    room.unseenChatsCount,
    isAppHidden,
    updateRoomReadCounter,
  ]);

  const sendMessage = React.useCallback(
    (message: string) => {
      onSendMessage({
        message,
        orgId: room.orgId,
        roomId: room.customId,
      });
    },
    [room.orgId, room.customId, onSendMessage]
  );

  const onBack = () => {
    history.push(`/app/orgs/${room.orgId}/chat`);
  };

  return (
    <div style={{ flexDirection: "column", width: "100%", display: "flex" }}>
      <ChatRoomHeader recipient={recipient} onBack={onBack} />
      <div style={{ flex: 1, overflow: "hidden" }}>
        <ChatList user={user} chats={room.chats} recipient={recipient} />
      </div>
      <ChatInput onSendMessage={sendMessage} />
    </div>
  );
};

export default React.memo(ChatRoom);
