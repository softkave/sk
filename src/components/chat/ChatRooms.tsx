import React from "react";
import { IRoom } from "../../models/chat/types";
import { IUser } from "../../models/user/user";
import {
    ISendMessageAPIParameters,
    IUpdateRoomReadCounterAPIParameters,
} from "../../net/chat";
import RenderForDevice from "../RenderForDevice";
import StyledContainer from "../styled/Container";
import ChatRoom from "./ChatRoom";
import RoomsList from "./RoomsList";

export interface IChatRoomsProps {
    sortedRooms: IRoom[];
    recipientsMap: { [key: string]: IUser };
    updateRoomReadCounter: (args: IUpdateRoomReadCounterAPIParameters) => void;
    onSendMessage: (args: Required<ISendMessageAPIParameters>) => void;
}

const ChatRooms: React.FC<IChatRoomsProps> = (props) => {
    const { sortedRooms } = props;
    const [
        selectedRoomRecipientId,
        setSelectedRoomRecipientId,
    ] = React.useState<string | undefined>();

    const selectedRoom = React.useMemo(() => {
        if (selectedRoomRecipientId) {
            return sortedRooms.find(
                (room) => room.recipientId === selectedRoomRecipientId
            );
        }
    }, [selectedRoomRecipientId, sortedRooms]);

    const onSelectRoom = React.useCallback((room: IRoom) => {
        setSelectedRoomRecipientId(room.recipientId);
    }, []);

    const mobileRender = React.useCallback(() => {
        if (selectedRoom) {
            return <ChatRoom {...props} room={selectedRoom} />;
        } else {
            return (
                <RoomsList
                    {...props}
                    selectedRoomRecipientId={selectedRoomRecipientId}
                    onSelectRoom={onSelectRoom}
                />
            );
        }
    }, []);

    const desktopRender = React.useCallback(() => {
        return (
            <StyledContainer>
                <RoomsList
                    {...props}
                    selectedRoomRecipientId={selectedRoomRecipientId}
                    onSelectRoom={onSelectRoom}
                />
                {selectedRoom && <ChatRoom {...props} room={selectedRoom} />}
            </StyledContainer>
        );
    }, []);

    return (
        <RenderForDevice
            renderForMobile={mobileRender}
            renderForDesktop={desktopRender}
        />
    );
};

export default ChatRooms;
