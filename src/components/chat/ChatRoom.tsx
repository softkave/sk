import React from "react";
import { useHistory } from "react-router";
import { IRoom } from "../../models/chat/types";
import { ICollaborator } from "../../models/collaborator/types";
import { IUser } from "../../models/user/types";
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
  updateRoomReadCounter: (args: IUpdateRoomReadCounterAPIParameters) => void;
  onSendMessage: (args: ISendMessageEndpointParameters) => void;
}

const ChatRoom: React.FC<IChatRoomProps> = (props) => {
  const { room, recipient, user, updateRoomReadCounter, onSendMessage } = props;

  const history = useHistory();
  React.useEffect(() => {
    if (room.unseenChatsCount > 0) {
      updateRoomReadCounter({
        orgId: room.workspaceId,
        roomId: room.customId,
        readCounter: getDateString(),
      });
    }
  }, [
    room.customId,
    room.workspaceId,
    room.chats.length,
    room.unseenChatsCount,
    updateRoomReadCounter,
  ]);

  const sendMessage = React.useCallback(
    (message: string) => {
      onSendMessage({
        message,
        orgId: room.workspaceId,
        roomId: room.customId,
      });
    },
    [room.workspaceId, room.customId, onSendMessage]
  );

  const onBack = () => {
    history.push(`/app/orgs/${room.workspaceId}/chat`);
  };

  // TODO: auth check
  const canChat = true;

  return (
    <div style={{ flexDirection: "column", width: "100%", display: "flex" }}>
      <ChatRoomHeader recipient={recipient} onBack={onBack} />
      <div style={{ flex: 1, overflow: "hidden" }}>
        <ChatList user={user} chats={room.chats} recipient={recipient} />
      </div>
      {canChat && <ChatInput onSendMessage={sendMessage} />}
    </div>
  );
};

export default React.memo(ChatRoom);
