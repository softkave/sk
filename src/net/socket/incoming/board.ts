import { SystemActionType } from "../../../models/app/types";
import { IBoard } from "../../../models/board/types";
import { IResourceWithId } from "../../../models/types";
import { completeCreateBoard } from "../../../redux/operations/board/createBoard";
import { completeDeleteBoard } from "../../../redux/operations/board/deleteBoard";
import { completeUpdateBoard } from "../../../redux/operations/board/updateBoard";
import store from "../../../redux/store";
import { IIncomingResourceUpdatePacket } from "../incomingEventTypes";

function handleCreateBoard(packet: IIncomingResourceUpdatePacket<IBoard>) {
  completeCreateBoard(store, packet.resource);
}

function handleUpdateBoard(packet: IIncomingResourceUpdatePacket<IBoard>) {
  completeUpdateBoard(store, packet.resource);
}

function handleDeleteBoard(
  packet: IIncomingResourceUpdatePacket<IResourceWithId>
) {
  completeDeleteBoard(store, packet.resource.customId);
}

export function handleIncomingBoardEvent(
  packet: IIncomingResourceUpdatePacket<IBoard>
) {
  switch (packet.actionType) {
    case SystemActionType.Create:
      handleCreateBoard(packet);
      break;
    case SystemActionType.Update:
      handleUpdateBoard(packet);
      break;
    case SystemActionType.Delete:
      handleDeleteBoard(packet);
      break;
  }
}
