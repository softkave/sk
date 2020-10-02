import React from "react";
import { IRoom } from "../../models/chat/types";
import { IUser } from "../../models/user/user";
import StyledContainer from "../styled/Container";

export interface IRoomsListItemProps {
    room: IRoom;
    recipient: IUser;
    onSelectRoom: (room: IRoom) => void;

    selected?: boolean;
}

const RoomsListItem: React.FC<IRoomsListItemProps> = (props) => {
    const { room, recipient, selected, onSelectRoom } = props;

    const styles = React.useMemo((): React.CSSProperties => {
        if (selected) {
            return {
                cursor: "pointer",
            };
        } else {
            return {};
        }
    }, [selected]);

    return (
        <StyledContainer
            onClick={() => onSelectRoom(room)}
            s={styles}
        ></StyledContainer>
    );
};

export default React.memo(RoomsListItem);
