import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";
import { Space } from "antd";
import React from "react";
import { IUser } from "../../models/user/user";
import ItemAvatar from "../ItemAvatar";
import StyledContainer from "../styled/Container";
import theme from "../theme";
import UserOptionsMenu, { UserOptionsMenuKeys } from "./UserOptionsMenu";

export interface IAppHomeDesktopMenuProps {
    user: IUser;
    onSelect: (key: UserOptionsMenuKeys) => void;
}

const AppHomeDesktopMenu: React.FC<IAppHomeDesktopMenuProps> = (props) => {
    const { user, onSelect } = props;

    const [showMenu, setShowMenu] = React.useState(false);

    return (
        <StyledContainer
            s={{
                padding: "16px",
                cursor: "pointer",
                borderTop: "1px solid #d9d9d9",
                flexDirection: "column",
                width: "100%",
            }}
            onClick={() => setShowMenu(!showMenu)}
        >
            {showMenu && <UserOptionsMenu onSelect={onSelect} />}
            <Space size={"middle"}>
                <ItemAvatar
                    clickable
                    size="small"
                    onClick={() => null}
                    color={user.color || theme.colors.defaults.avatar}
                />
                {user.name}
                {showMenu ? <CaretUpOutlined /> : <CaretDownOutlined />}
            </Space>
        </StyledContainer>
    );
};

export default AppHomeDesktopMenu;
