import React from "react";
import { getUserInitials, IUser } from "../../models/user/user";
import ItemAvatar, { IItemAvatarProps } from "../ItemAvatar";

export interface IUserAvatarProps extends IItemAvatarProps {
    user: IUser;
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
