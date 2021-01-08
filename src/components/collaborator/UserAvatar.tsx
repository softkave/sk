import React from "react";
import { getUserInitials, ICollaborator } from "../../models/user/user";
import ItemAvatar, { IItemAvatarProps } from "../ItemAvatar";

export interface IUserAvatarProps extends IItemAvatarProps {
    user: ICollaborator;
}

const UserAvatar: React.FC<IUserAvatarProps> = (props) => {
    const { user } = props;

    return (
        <ItemAvatar {...props} color={user.color}>
            {getUserInitials(user)}
        </ItemAvatar>
    );
};

export default UserAvatar;
