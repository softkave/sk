import { noop } from "lodash";
import React from "react";
import { IAppWorkspace } from "../../models/organization/types";
import MessageList from "../MessageList";
import RoomsList from "../chat/RoomsList";
import useChatRooms from "../chat/useChatRooms";
import LoadingEllipsis from "../utils/LoadingEllipsis";
import ListHeader from "../utils/list/ListHeader";
import { organizationSidebarClasses } from "./utils";

export interface IWorkspaceSidebarChatProps {
  organization: IAppWorkspace;
}

const OrganizationSidebarChat: React.FC<IWorkspaceSidebarChatProps> = (props) => {
  const { organization } = props;
  const [searchQuery, setSearchQuery] = React.useState("");
  const {
    chatRooms: sortedRooms,
    chatRoomsLoadState: loadState,
    selectedRoomRecipientId,
    onSelectRoom,
  } = useChatRooms({ orgId: organization.customId });
  let contentNode: React.ReactNode = null;

  if (loadState?.error) {
    contentNode = <MessageList maxWidth messages={loadState.error} />;
  } else if (loadState?.isLoading || !loadState?.initialized) {
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
    <div className={organizationSidebarClasses.root}>
      <ListHeader
        hideAddButton
        onCreate={noop}
        onSearchTextChange={setSearchQuery}
        searchInputPlaceholder={"Search chats..."}
        className={organizationSidebarClasses.header}
        title={"Chat"}
      />
      {contentNode}
    </div>
  );
};

export default React.memo(OrganizationSidebarChat);
