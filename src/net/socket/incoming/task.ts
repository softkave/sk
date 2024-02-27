import { SystemActionType } from "../../../models/app/types";
import { ITask } from "../../../models/task/types";
import { IResourceWithId } from "../../../models/types";
import { completeCreateTask } from "../../../redux/operations/task/createTask";
import { completeDeleteTask } from "../../../redux/operations/task/deleteTask";
import { completeUpdateTask } from "../../../redux/operations/task/updateTask";
import store from "../../../redux/store";
import { IIncomingResourceUpdatePacket } from "../incomingEventTypes";

function handleCreateTask(packet: IIncomingResourceUpdatePacket<ITask>) {
  completeCreateTask(store, packet.resource);
}

function handleUpdateTask(packet: IIncomingResourceUpdatePacket<ITask>) {
  completeUpdateTask(store, packet.resource);
}

function handleDeleteTask(
  packet: IIncomingResourceUpdatePacket<IResourceWithId>
) {
  completeDeleteTask(store, packet.resource.customId);
}

export function handleIncomingTaskEvent(
  packet: IIncomingResourceUpdatePacket<ITask>
) {
  switch (packet.actionType) {
    case SystemActionType.Create:
      handleCreateTask(packet);
      break;
    case SystemActionType.Update:
      handleUpdateTask(packet);
      break;
    case SystemActionType.Delete:
      handleDeleteTask(packet);
      break;
  }
}
