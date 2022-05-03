import React from "react";
import { IAppOrganization } from "../../models/organization/types";
import { noop } from "lodash";
import RoomsList from "../chat/RoomsList";
import ListHeader from "../utilities/ListHeader";
import { organizationSidebarClasses } from "./utils";
import useChatRooms from "../chat/useChatRooms";
import MessageList from "../MessageList";
import LoadingEllipsis from "../utilities/LoadingEllipsis";

export interface IOrganizationSidebarChatProps {
  organization: IAppOrganization;
}

const OrganizationSidebarChat: React.FC<IOrganizationSidebarChatProps> = (
  props
) => {
  const { organization } = props;
  const [searchQuery, setSearchQuery] = React.useState("");
  const {
    sortedRooms,
    chatRoomsLoadState: loadState,
    selectedRoomRecipientId,
    onSelectRoom,
  } = useChatRooms({ orgId: organization.customId });
  let contentNode: React.ReactNode = null;

  if (loadState.error) {
    contentNode = <MessageList messages={loadState.error} />;
  } else if (loadState.isLoading || !loadState.initialized) {
    contentNode = <LoadingEllipsis />;
  } else {
    contentNode = (
      <RoomsList
        searchQuery={searchQuery}
        selectedRoomRecipientId={selectedRoomRecipientId}
        sortedRooms={sortedRooms}
        onSelectRoom={onSelectRoom}
      />
    );
  }

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
      {contentNode}
    </div>
  );
};

export default React.memo(OrganizationSidebarChat);
