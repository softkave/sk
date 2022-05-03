import { Dropdown } from "antd";
import React from "react";
import { IUser } from "../../models/user/user";
import ItemAvatar from "../ItemAvatar";
import appTheme from "../theme";
import UserOptionsMenu, { UserOptionsMenuKeys } from "./UserOptionsMenu";

export interface IHeaderMobileMenuProps {
  user: IUser;
  onSelect: (key: UserOptionsMenuKeys) => void;
}

const HeaderMobileMenu: React.FC<IHeaderMobileMenuProps> = (props) => {
  const { user, onSelect } = props;

  const [visible, setVisible] = React.useState(false);

  const internalOnSelect = (key: UserOptionsMenuKeys) => {
    setVisible(false);
    onSelect(key);
  };

  return (
    <Dropdown
      visible={visible}
      onVisibleChange={setVisible}
      overlay={<UserOptionsMenu onSelect={internalOnSelect} />}
      trigger={["click"]}
    >
      <ItemAvatar
        clickable
        size="small"
        onClick={() => null}
        color={user.color || appTheme.colors.defaults.avatar}
      />
    </Dropdown>
  );
};

export default HeaderMobileMenu;
