import { IRoom } from "../../../models/chat/types";
import { getTempRoomId } from "../../../models/chat/utils";
import { ICollaborator } from "../../../models/collaborator/types";
import { IAppOrganization } from "../../../models/organization/types";
import KeyValueActions from "../../key-value/actions";
import KeyValueSelectors from "../../key-value/selectors";
import { KeyValueKeys } from "../../key-value/types";
import RoomActions from "../../rooms/actions";
import RoomSelectors from "../../rooms/selectors";
import { IRoomsMap } from "../../rooms/types";
import SessionSelectors from "../../session/selectors";
import UserSelectors from "../../users/selectors";
import { makeAsyncOp02 } from "../utils";

export const populateOrganizationRoomsOpAction = makeAsyncOp02(
  "op/organizations/populateOrganizationRooms",
  async (arg: { organization: IAppOrganization }, thunkAPI) => {
    const existingRooms = RoomSelectors.getOrgRooms(
      thunkAPI.getState(),
      arg.organization.customId
    );

    const user = SessionSelectors.assertGetUser(thunkAPI.getState());
    const collaborators = UserSelectors.getMany(
      thunkAPI.getState(),
      arg.organization.collaboratorIds
    );

    const tempRooms = createOrgCollaboratorsTempRooms(
      collaborators,
      existingRooms,
      user.customId,
      arg.organization.customId
    );

    thunkAPI.dispatch(RoomActions.bulkAddRooms(tempRooms));
    let unseenChatsCountMapByOrg = KeyValueSelectors.getKey(
      thunkAPI.getState(),
      KeyValueKeys.UnseenChatsCountByOrg
    );

    unseenChatsCountMapByOrg = { ...unseenChatsCountMapByOrg };
    tempRooms.forEach((rm) => {
      unseenChatsCountMapByOrg[rm.orgId] =
        (unseenChatsCountMapByOrg[rm.orgId] || 0) + rm.unseenChatsCount;
    });

    thunkAPI.dispatch(
      KeyValueActions.setKey({
        key: KeyValueKeys.UnseenChatsCountByOrg,
        value: unseenChatsCountMapByOrg,
      })
    );
  }
);

function createOrgCollaboratorsTempRooms(
  collaborators: ICollaborator[],
  existingRooms: IRoom[],
  userId: string,
  orgId: string
) {
  const existingRoomsMapByRecipientId: IRoomsMap = {};
  existingRooms.forEach((room) => {
    const recipientMemberData = room.members.find(
      (member) => member.userId !== userId
    )!;
    existingRoomsMapByRecipientId[recipientMemberData.userId] = room;
  });

  const tempRooms: IRoom[] = [];
  collaborators.forEach((collaborator) => {
    if (collaborator.customId === userId) {
      return;
    }

    const existingRoom = existingRoomsMapByRecipientId[collaborator.customId];

    if (!!existingRoom) {
      return;
    }

    // Collaborator can share multiple orgs with user
    const tempRoomId = getTempRoomId(orgId, collaborator.customId);
    const tempRoom: IRoom = {
      orgId,
      customId: tempRoomId,
      name: "",
      createdAt: "",
      createdBy: "",
      members: [
        { userId, readCounter: "" },
        { userId: collaborator.customId, readCounter: "" },
      ],
      recipientId: collaborator.customId,
      unseenChatsStartIndex: null,
      unseenChatsCount: 0,
      chats: [],
    };

    tempRooms.push(tempRoom);
  });

  return tempRooms;
}
