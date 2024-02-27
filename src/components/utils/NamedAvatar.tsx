import ItemAvatar, { IItemAvatarProps } from "../ItemAvatar";

export interface INamedAvatarProps extends IItemAvatarProps {
  item: { name: string; color: string };
}

const NamedAvatar: React.FC<INamedAvatarProps> = (props) => {
  const { item } = props;
  return (
    <ItemAvatar {...props} color={item.color}>
      {item.name}
    </ItemAvatar>
  );
};

export default NamedAvatar;
