import { ICollaborator } from "../../models/collaborator/types";
import { getUserInitials } from "../../models/collaborator/utils";
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
