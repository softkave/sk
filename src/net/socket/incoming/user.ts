import { SystemActionType } from "../../../models/app/types";
import { IUser } from "../../../models/user/user";
import store from "../../../redux/store";
import UserActions from "../../../redux/users/actions";
import { IIncomingResourceUpdatePacket } from "../incomingEventTypes";

function handleUpdateUser(packet: IIncomingResourceUpdatePacket<IUser>) {
  store.dispatch(
    UserActions.update({
      id: packet.resource.customId,
      data: packet.resource,
      meta: { arrayUpdateStrategy: "replace" },
    })
  );
}

export function handleIncomingUserEvent(
  packet: IIncomingResourceUpdatePacket<IUser>
) {
  switch (packet.actionType) {
    case SystemActionType.Update:
      handleUpdateUser(packet);
      break;
  }
}
