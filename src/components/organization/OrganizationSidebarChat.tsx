import React from "react";
import { IAppOrganization } from "../../models/organization/types";
import { noop } from "lodash";
import RoomsList from "../chat/RoomsList";
import ListHeader from "../utilities/ListHeader";
import { organizationSidebarClasses } from "./utils";
import useChatRooms from "../chat/useChatRooms";

export interface IOrganizationSidebarChatProps {
  organization: IAppOrganization;
}

const OrganizationSidebarChat: React.FC<IOrganizationSidebarChatProps> = (
  props
) => {
  const { organization } = props;
  const [searchQuery, setSearchQuery] = React.useState("");
  const { sortedRooms, recipientsMap, selectedRoomRecipientId, onSelectRoom } =
    useChatRooms({ orgId: organization.customId });

  return (
    <div className={organizationSidebarClasses.list}>
      <ListHeader
        hideAddButton
        onCreate={noop}
        onSearchTextChange={setSearchQuery}
        placeholder={"Search chats..."}
        className={organizationSidebarClasses.header}
        title={"Chat"}
      />
      <RoomsList
        searchQuery={searchQuery}
        selectedRoomRecipientId={selectedRoomRecipientId}
        sortedRooms={sortedRooms}
        recipientsMap={recipientsMap}
        onSelectRoom={onSelectRoom}
      />
    </div>
  );
};

export default React.memo(OrganizationSidebarChat);
