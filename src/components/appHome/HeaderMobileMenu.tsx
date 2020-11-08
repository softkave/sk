import { Dropdown } from "antd";
import React from "react";
import { IUser } from "../../models/user/user";
import ItemAvatar from "../ItemAvatar";
import theme from "../theme";
import UserOptionsMenu, { UserOptionsMenuKeys } from "./UserOptionsMenu";

export interface IHeaderMobileMenuProps {
    user: IUser;
    onSelect: (key: UserOptionsMenuKeys) => void;
}

const HeaderMobileMenu: React.FC<IHeaderMobileMenuProps> = (props) => {
    const { user, onSelect } = props;

    return (
        <Dropdown
            overlay={<UserOptionsMenu onSelect={onSelect} />}
            trigger={["click"]}
        >
            <ItemAvatar
                clickable
                size="small"
                onClick={() => null}
                color={user.color || theme.colors.defaults.avatar}
            />
        </Dropdown>
    );
};

export default HeaderMobileMenu;
